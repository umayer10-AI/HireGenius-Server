import { ObjectId } from "mongodb";
import { companyRepository } from "../repositories/company.repository";
import { jobRepository } from "../repositories/job.repository";
import { savedJobRepository } from "../repositories";
import { userRepository } from "../repositories/user.repository";
import type { UserDocument } from "../interfaces/models";
import { ConflictError, ForbiddenError, NotFoundError } from "../utils/errors";
import { buildPaginationMeta } from "../utils/response";
import { createNotification } from "./notification.service";

export class SavedJobService {
  async save(jobId: string, user: UserDocument) {
    if (!user._id) throw new ForbiddenError("Invalid user");
    const job = await jobRepository.findByIdOrThrow(jobId, "Job not found");
    const existing = await savedJobRepository.findExisting(user._id, job._id!);
    if (existing) throw new ConflictError("Job already saved");

    const now = new Date();
    const saved = await savedJobRepository.insertOne({
      userId: user._id,
      jobId: job._id!,
      createdAt: now,
      updatedAt: now,
    });
    await userRepository.pushSavedJob(user._id, job._id!);
    await createNotification({
      receiverId: user._id,
      title: "Job saved",
      message: `${job.title} was added to your saved jobs`,
      type: "success",
      link: `/dashboard/saved-jobs`,
    });
    return saved;
  }

  async list(user: UserDocument, page: number, limit: number) {
    if (!user._id) throw new ForbiddenError("Invalid user");
    const { data, total } = await savedJobRepository.listByUser(user._id, page, limit);
    const enriched = await Promise.all(
      data.map(async (item) => {
        const job = await jobRepository.findById(item.jobId);
        const company = job ? await companyRepository.findById(job.companyId) : null;
        return {
          ...item,
          job: job
            ? {
                ...job,
                company: company
                  ? {
                      _id: company._id,
                      companyName: company.companyName,
                      logo: company.logo,
                    }
                  : null,
              }
            : null,
        };
      })
    );
    return {
      data: enriched,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async remove(idOrJobId: string, user: UserDocument) {
    if (!user._id) throw new ForbiddenError("Invalid user");

    let jobId: ObjectId | null = null;
    const byId = await savedJobRepository.findById(idOrJobId);
    if (byId) {
      if (byId.userId.toString() !== user._id.toString()) {
        throw new ForbiddenError("Forbidden");
      }
      jobId = byId.jobId;
      await savedJobRepository.deleteById(idOrJobId);
    } else if (ObjectId.isValid(idOrJobId)) {
      const deleted = await savedJobRepository.deleteByUserAndJob(
        user._id,
        new ObjectId(idOrJobId)
      );
      if (!deleted) throw new NotFoundError("Saved job not found");
      jobId = new ObjectId(idOrJobId);
    } else {
      throw new NotFoundError("Saved job not found");
    }

    if (jobId) {
      await userRepository.pullSavedJob(user._id, jobId);
    }
    return { deleted: true };
  }
}

export const savedJobService = new SavedJobService();
