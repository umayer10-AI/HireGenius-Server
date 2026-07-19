import { applicationRepository } from "../repositories/application.repository.js";
import { companyRepository } from "../repositories/company.repository.js";
import { jobRepository } from "../repositories/job.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import type { ApplicationDocument, UserDocument } from "../interfaces/models.js";
import type { ApplicationStatus } from "../types/index.js";
import { ConflictError, ForbiddenError } from "../utils/errors.js";
import { buildPaginationMeta } from "../utils/response.js";
import { createNotification } from "./notification.service.js";
import {
  sendApplicationStatusEmail,
  sendApplicationSubmittedEmail,
} from "./email.service.js";
import { uploadBufferToCloudinary } from "./upload.service.js";

export class ApplicationService {
  async apply(
    input: {
      jobId: string;
      coverLetter?: string;
      expectedSalary?: number;
      portfolio?: string;
      github?: string;
      linkedin?: string;
      resume?: string;
    },
    candidate: UserDocument,
    resumeFile?: Express.Multer.File
  ) {
    if (!candidate._id) throw new ForbiddenError("Invalid user");
    if (candidate.role !== "candidate" && candidate.role !== "admin") {
      throw new ForbiddenError("Only candidates can apply to jobs");
    }

    const job = await jobRepository.findByIdOrThrow(input.jobId, "Job not found");
    if (job.status !== "active") {
      throw new ConflictError("This job is no longer accepting applications");
    }

    const existing = await applicationRepository.findExisting(job._id!, candidate._id);
    if (existing) throw new ConflictError("You have already applied to this job");

    let resumeUrl = input.resume || candidate.resume;
    if (resumeFile) {
      const uploaded = await uploadBufferToCloudinary(resumeFile.buffer, "applications", "raw");
      resumeUrl = uploaded.secure_url;
    }
    if (!resumeUrl) throw new ConflictError("Resume is required to apply");

    const now = new Date();
    const application = await applicationRepository.insertOne({
      jobId: job._id!,
      candidateId: candidate._id,
      resume: resumeUrl,
      coverLetter: input.coverLetter,
      expectedSalary: input.expectedSalary,
      portfolio: input.portfolio || candidate.portfolio,
      github: input.github || candidate.github,
      linkedin: input.linkedin || candidate.linkedin,
      status: "Applied",
      createdAt: now,
      updatedAt: now,
    });

    await userRepository.pushAppliedJob(candidate._id, job._id!);

    const company = await companyRepository.findById(job.companyId);
    await createNotification({
      receiverId: job.createdBy,
      title: "New application received",
      message: `${candidate.name} applied for ${job.title}`,
      type: "info",
      link: `/dashboard/applicants`,
    });

    await sendApplicationSubmittedEmail(
      candidate.name,
      candidate.email,
      job.title,
      company?.companyName || "Company"
    );

    return application;
  }

  async list(
    params: {
      page: number;
      limit: number;
      status?: string;
      jobId?: string;
      candidateId?: string;
      sort?: string;
    },
    requester: UserDocument
  ) {
    const query = { ...params };

    if (requester.role === "candidate") {
      query.candidateId = requester._id!.toString();
    } else if (requester.role === "recruiter") {
      if (!query.jobId) {
        const myJobs = await jobRepository.findMany({ createdBy: requester._id });
        const jobIds = myJobs.map((j) => j._id!).filter(Boolean);
        const all: ApplicationDocument[] = [];
        let total = 0;
        for (const jobId of jobIds) {
          const result = await applicationRepository.list({
            ...query,
            jobId: jobId.toString(),
            page: 1,
            limit: 1000,
          });
          all.push(...result.data);
          total += result.total;
        }
        all.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const start = (params.page - 1) * params.limit;
        const sliced = all.slice(start, start + params.limit);
        const enriched = await this.enrich(sliced);
        return {
          data: enriched,
          meta: buildPaginationMeta(params.page, params.limit, total),
        };
      }
      const job = await jobRepository.findByIdOrThrow(query.jobId, "Job not found");
      if (job.createdBy.toString() !== requester._id?.toString()) {
        throw new ForbiddenError("Forbidden");
      }
    }

    const { data, total } = await applicationRepository.list(query);
    return {
      data: await this.enrich(data),
      meta: buildPaginationMeta(params.page, params.limit, total),
    };
  }

  private async enrich(applications: ApplicationDocument[]) {
    return Promise.all(
      applications.map(async (app) => {
        const [job, candidate] = await Promise.all([
          jobRepository.findById(app.jobId),
          userRepository.findById(app.candidateId),
        ]);
        const company = job ? await companyRepository.findById(job.companyId) : null;
        return {
          ...app,
          job: job
            ? {
                _id: job._id,
                title: job.title,
                slug: job.slug,
                location: job.location,
                companyName: company?.companyName,
                companyLogo: company?.logo,
              }
            : null,
          candidate: candidate
            ? {
                _id: candidate._id,
                name: candidate.name,
                email: candidate.email,
                image: candidate.image,
                skills: candidate.skills,
                resume: candidate.resume,
              }
            : null,
        };
      })
    );
  }

  async getById(id: string, requester: UserDocument) {
    const application = await applicationRepository.findByIdOrThrow(id, "Application not found");
    const job = await jobRepository.findById(application.jobId);
    const isOwner = application.candidateId.toString() === requester._id?.toString();
    const isRecruiter =
      job && job.createdBy.toString() === requester._id?.toString();
    if (requester.role !== "admin" && !isOwner && !isRecruiter) {
      throw new ForbiddenError("Forbidden");
    }
    const [enriched] = await this.enrich([application]);
    return enriched;
  }

  async updateStatus(
    id: string,
    updates: { status?: ApplicationStatus; notes?: string },
    requester: UserDocument
  ) {
    const application = await applicationRepository.findByIdOrThrow(id, "Application not found");
    const job = await jobRepository.findByIdOrThrow(application.jobId, "Job not found");

    if (
      requester.role !== "admin" &&
      job.createdBy.toString() !== requester._id?.toString()
    ) {
      throw new ForbiddenError("Only recruiters can update application status");
    }

    const updated = await applicationRepository.updateById(id, {
      $set: { ...updates, updatedAt: new Date() },
    });

    if (updates.status) {
      const candidate = await userRepository.findById(application.candidateId);
      if (candidate) {
        await createNotification({
          receiverId: candidate._id!,
          title: "Application status updated",
          message: `Your application for ${job.title} is now ${updates.status}`,
          type: updates.status === "Rejected" ? "warning" : "success",
          link: `/dashboard/applications`,
        });
        await sendApplicationStatusEmail(
          candidate.name,
          candidate.email,
          job.title,
          updates.status
        );
      }
    }

    return updated;
  }

  async remove(id: string, requester: UserDocument) {
    const application = await applicationRepository.findByIdOrThrow(id, "Application not found");
    if (
      requester.role !== "admin" &&
      application.candidateId.toString() !== requester._id?.toString()
    ) {
      throw new ForbiddenError("Forbidden");
    }
    await applicationRepository.deleteById(id);
    return { deleted: true };
  }
}

export const applicationService = new ApplicationService();
