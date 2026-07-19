import { getCollection } from "../config/database.js";
import { COLLECTIONS } from "../constants/index.js";
import type {
  ApplicationDocument,
  CompanyDocument,
  JobDocument,
  UserDocument,
} from "../interfaces/models.js";

export class DashboardService {
  async getCandidateDashboard(user: UserDocument) {
    const applications = getCollection<ApplicationDocument>(COLLECTIONS.APPLICATIONS);
    const jobs = getCollection<JobDocument>(COLLECTIONS.JOBS);

    const [appliedCount, interviewCount, recentApplications, recommended] =
      await Promise.all([
        applications.countDocuments({ candidateId: user._id }),
        applications.countDocuments({
          candidateId: user._id,
          status: "Interview Scheduled",
        }),
        applications.find({ candidateId: user._id }).sort({ createdAt: -1 }).limit(5).toArray(),
        jobs
          .find({
            status: "active",
            skills: { $in: user.skills?.length ? user.skills : ["JavaScript"] },
          })
          .limit(6)
          .toArray(),
      ]);

    const statusBreakdown = await applications
      .aggregate<{ _id: string; count: number }>([
        { $match: { candidateId: user._id } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])
      .toArray();

    const monthly = await applications
      .aggregate<{ _id: { year: number; month: number }; count: number }>([
        { $match: { candidateId: user._id } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
      ])
      .toArray();

    return {
      stats: {
        appliedJobs: appliedCount,
        savedJobs: user.savedJobs?.length || 0,
        interviews: interviewCount,
        profileCompletion: 0,
      },
      recentApplications,
      recommendedJobs: recommended,
      charts: {
        statusBreakdown: statusBreakdown.map((s) => ({
          name: s._id,
          value: s.count,
        })),
        monthlyApplications: monthly.map((m) => ({
          name: `${m._id.month}/${m._id.year}`,
          value: m.count,
        })),
      },
    };
  }

  async getRecruiterDashboard(user: UserDocument) {
    const jobs = getCollection<JobDocument>(COLLECTIONS.JOBS);
    const applications = getCollection<ApplicationDocument>(COLLECTIONS.APPLICATIONS);
    const companies = getCollection<CompanyDocument>(COLLECTIONS.COMPANIES);

    const myJobs = await jobs.find({ createdBy: user._id }).toArray();
    const jobIds = myJobs.map((j) => j._id!).filter(Boolean);

    const [activeJobs, expiredJobs, applicationCount, companyCount, recentApplicants] =
      await Promise.all([
        jobs.countDocuments({ createdBy: user._id, status: "active" }),
        jobs.countDocuments({
          createdBy: user._id,
          applicationDeadline: { $lt: new Date() },
        }),
        applications.countDocuments({ jobId: { $in: jobIds } }),
        companies.countDocuments({ ownerId: user._id }),
        applications
          .find({ jobId: { $in: jobIds } })
          .sort({ createdAt: -1 })
          .limit(8)
          .toArray(),
      ]);

    const appsByDay = await applications
      .aggregate<{ _id: string; count: number }>([
        { $match: { jobId: { $in: jobIds } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 14 },
      ])
      .toArray();

    return {
      stats: {
        jobsPosted: myJobs.length,
        activeJobs,
        expiredJobs,
        applications: applicationCount,
        companies: companyCount,
      },
      recentApplicants,
      charts: {
        applicationsTrend: appsByDay.map((d) => ({ name: d._id, value: d.count })),
        jobsByStatus: [
          { name: "Active", value: activeJobs },
          { name: "Expired", value: expiredJobs },
          { name: "Total", value: myJobs.length },
        ],
      },
    };
  }

  async getAdminDashboard() {
    const users = getCollection<UserDocument>(COLLECTIONS.USERS);
    const jobs = getCollection<JobDocument>(COLLECTIONS.JOBS);
    const companies = getCollection<CompanyDocument>(COLLECTIONS.COMPANIES);
    const applications = getCollection<ApplicationDocument>(COLLECTIONS.APPLICATIONS);

    const [
      totalUsers,
      recruiters,
      candidates,
      totalCompanies,
      totalJobs,
      totalApplications,
      growth,
    ] = await Promise.all([
      users.countDocuments(),
      users.countDocuments({ role: "recruiter" }),
      users.countDocuments({ role: "candidate" }),
      companies.countDocuments(),
      jobs.countDocuments(),
      applications.countDocuments(),
      users
        .aggregate<{ _id: string; count: number }>([
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $limit: 12 },
        ])
        .toArray(),
    ]);

    return {
      stats: {
        users: totalUsers,
        recruiters,
        candidates,
        companies: totalCompanies,
        jobs: totalJobs,
        applications: totalApplications,
      },
      charts: {
        userGrowth: growth.map((g) => ({ name: g._id, value: g.count })),
        roleDistribution: [
          { name: "Candidates", value: candidates },
          { name: "Recruiters", value: recruiters },
          { name: "Admins", value: Math.max(0, totalUsers - candidates - recruiters) },
        ],
      },
    };
  }

  async getPlatformStats() {
    const users = getCollection<UserDocument>(COLLECTIONS.USERS);
    const jobs = getCollection<JobDocument>(COLLECTIONS.JOBS);
    const companies = getCollection<CompanyDocument>(COLLECTIONS.COMPANIES);
    const applications = getCollection<ApplicationDocument>(COLLECTIONS.APPLICATIONS);

    const [jobCount, companyCount, candidateCount, recruiterCount, applicationCount] =
      await Promise.all([
        jobs.countDocuments({ status: "active" }),
        companies.countDocuments(),
        users.countDocuments({ role: "candidate" }),
        users.countDocuments({ role: "recruiter" }),
        applications.countDocuments(),
      ]);

    return {
      jobs: jobCount,
      companies: companyCount,
      candidates: candidateCount,
      recruiters: recruiterCount,
      applications: applicationCount,
    };
  }
}

export const dashboardService = new DashboardService();
