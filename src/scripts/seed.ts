import bcrypt from "bcrypt";
import { connectDatabase, disconnectDatabase, getCollection } from "../config/database";
import { COLLECTIONS } from "../constants";
import type {
  BlogDocument,
  CompanyDocument,
  JobDocument,
  UserDocument,
} from "../interfaces/models";
import { uniqueSlug } from "../utils/helpers";
import { logger } from "../utils/logger";

async function seed() {
  await connectDatabase();

  const users = getCollection<UserDocument>(COLLECTIONS.USERS);
  const companies = getCollection<CompanyDocument>(COLLECTIONS.COMPANIES);
  const jobs = getCollection<JobDocument>(COLLECTIONS.JOBS);
  const blogs = getCollection<BlogDocument>(COLLECTIONS.BLOGS);

  await Promise.all([
    users.deleteMany({}),
    companies.deleteMany({}),
    jobs.deleteMany({}),
    blogs.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("Password123!", 12);
  const now = new Date();

  const adminResult = await users.insertOne({
    name: "Ava Admin",
    email: "admin@hiregenius.ai",
    password: passwordHash,
    role: "admin",
    skills: ["Leadership", "Analytics"],
    education: [],
    experience: [],
    savedJobs: [],
    appliedJobs: [],
    isVerified: true,
    isPremium: true,
    emailVerified: true,
    searchHistory: [],
    recentlyViewedJobs: [],
    location: "San Francisco, CA",
    createdAt: now,
    updatedAt: now,
  });

  const recruiterResult = await users.insertOne({
    name: "Ryan Recruiter",
    email: "recruiter@hiregenius.ai",
    password: passwordHash,
    role: "recruiter",
    skills: ["Talent Acquisition", "People Ops"],
    education: [],
    experience: [],
    savedJobs: [],
    appliedJobs: [],
    isVerified: true,
    isPremium: true,
    emailVerified: true,
    searchHistory: [],
    recentlyViewedJobs: [],
    location: "New York, NY",
    createdAt: now,
    updatedAt: now,
  });

  await users.insertOne({
    name: "Casey Candidate",
    email: "candidate@hiregenius.ai",
    password: passwordHash,
    role: "candidate",
    phone: "+1 555 0100",
    bio: "Full-stack engineer passionate about AI-powered products.",
    skills: ["TypeScript", "React", "Node.js", "MongoDB", "Python"],
    education: [
      {
        institution: "State University",
        degree: "B.S.",
        field: "Computer Science",
        startYear: 2018,
        endYear: 2022,
      },
    ],
    experience: [
      {
        company: "Nova Labs",
        title: "Software Engineer",
        startDate: "2022-06",
        current: true,
        description: "Built hiring and analytics products with Next.js and Express.",
      },
    ],
    portfolio: "https://casey.dev",
    github: "https://github.com/casey",
    linkedin: "https://linkedin.com/in/casey",
    location: "Austin, TX",
    savedJobs: [],
    appliedJobs: [],
    isVerified: true,
    isPremium: false,
    emailVerified: true,
    searchHistory: [],
    recentlyViewedJobs: [],
    createdAt: now,
    updatedAt: now,
  });

  const companySeeds: Array<Omit<CompanyDocument, "_id">> = [
    {
      ownerId: recruiterResult.insertedId,
      companyName: "Nimbus Cloud",
      industry: "Cloud Computing",
      companySize: "201-500",
      description:
        "Nimbus Cloud builds developer-first infrastructure for modern SaaS teams worldwide.",
      location: "Seattle, WA",
      website: "https://nimbus.example",
      verified: true,
      rating: 4.7,
      reviewCount: 18,
      createdAt: now,
      updatedAt: now,
    },
    {
      ownerId: recruiterResult.insertedId,
      companyName: "Pixelcraft Studio",
      industry: "Design",
      companySize: "51-200",
      description:
        "Pixelcraft partners with startups to craft premium product experiences and design systems.",
      location: "Remote",
      website: "https://pixelcraft.example",
      verified: true,
      rating: 4.5,
      reviewCount: 12,
      createdAt: now,
      updatedAt: now,
    },
    {
      ownerId: recruiterResult.insertedId,
      companyName: "SignalAI",
      industry: "Artificial Intelligence",
      companySize: "11-50",
      description:
        "SignalAI helps enterprises turn unstructured data into actionable intelligence.",
      location: "Boston, MA",
      website: "https://signalai.example",
      verified: true,
      rating: 4.8,
      reviewCount: 9,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const companyIds = [];
  for (const company of companySeeds) {
    const result = await companies.insertOne(company);
    companyIds.push(result.insertedId);
  }

  const jobSeeds: Array<Omit<JobDocument, "_id">> = [
    {
      companyId: companyIds[0],
      createdBy: recruiterResult.insertedId,
      title: "Senior Full Stack Engineer",
      slug: uniqueSlug("Senior Full Stack Engineer"),
      shortDescription: "Own end-to-end features across Next.js and Node.js services.",
      description:
        "Join Nimbus Cloud to build scalable hiring and analytics experiences used by thousands of teams.",
      requirements: ["5+ years experience", "TypeScript", "React", "Node.js", "MongoDB"],
      responsibilities: [
        "Ship production features weekly",
        "Collaborate with design and product",
        "Improve reliability and performance",
      ],
      benefits: ["Remote-friendly", "Equity", "Learning stipend"],
      skills: ["TypeScript", "React", "Node.js", "MongoDB"],
      salary: { min: 140000, max: 180000 },
      currency: "USD",
      experience: "Senior",
      category: "Software Engineering",
      jobType: "full-time",
      workMode: "hybrid",
      location: "Seattle, WA",
      vacancies: 2,
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
      featured: true,
      status: "active",
      views: 120,
      createdAt: now,
      updatedAt: now,
    },
    {
      companyId: companyIds[1],
      createdBy: recruiterResult.insertedId,
      title: "Product Designer",
      slug: uniqueSlug("Product Designer"),
      shortDescription: "Design elegant product flows for a premium design studio.",
      description:
        "Pixelcraft is hiring a product designer to lead interaction design for SaaS clients.",
      requirements: ["3+ years product design", "Figma", "Design systems"],
      responsibilities: ["Lead discovery workshops", "Ship polished UI kits", "Partner with engineers"],
      benefits: ["Flexible hours", "Health coverage", "Home office stipend"],
      skills: ["Figma", "UI Design", "Prototyping"],
      salary: { min: 110000, max: 145000 },
      currency: "USD",
      experience: "Mid Level",
      category: "Design",
      jobType: "full-time",
      workMode: "remote",
      location: "Remote",
      vacancies: 1,
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      featured: true,
      status: "active",
      views: 88,
      createdAt: now,
      updatedAt: now,
    },
    {
      companyId: companyIds[2],
      createdBy: recruiterResult.insertedId,
      title: "Machine Learning Engineer",
      slug: uniqueSlug("Machine Learning Engineer"),
      shortDescription: "Build retrieval and ranking systems for enterprise AI products.",
      description:
        "SignalAI needs an ML engineer to improve recommendation quality and evaluation loops.",
      requirements: ["Python", "PyTorch or TensorFlow", "LLM experience"],
      responsibilities: ["Train and evaluate models", "Ship inference services", "Partner with product"],
      benefits: ["Competitive salary", "GPU budget", "Conference travel"],
      skills: ["Python", "PyTorch", "LLMs", "Vector Search"],
      salary: { min: 150000, max: 200000 },
      currency: "USD",
      experience: "Senior",
      category: "AI & Machine Learning",
      jobType: "full-time",
      workMode: "onsite",
      location: "Boston, MA",
      vacancies: 3,
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      featured: true,
      status: "active",
      views: 210,
      createdAt: now,
      updatedAt: now,
    },
    {
      companyId: companyIds[0],
      createdBy: recruiterResult.insertedId,
      title: "DevOps Engineer",
      slug: uniqueSlug("DevOps Engineer"),
      shortDescription: "Own CI/CD, observability, and cloud infrastructure reliability.",
      description: "Help Nimbus scale secure deployment pipelines across multiple regions.",
      requirements: ["AWS", "Kubernetes", "Terraform", "Observability"],
      responsibilities: ["Maintain clusters", "Improve deploy safety", "Reduce incident MTTR"],
      benefits: ["On-call stipend", "Equity", "Wellness benefits"],
      skills: ["AWS", "Kubernetes", "Terraform", "Grafana"],
      salary: { min: 130000, max: 170000 },
      currency: "USD",
      experience: "Mid Level",
      category: "DevOps",
      jobType: "full-time",
      workMode: "hybrid",
      location: "Seattle, WA",
      vacancies: 1,
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40),
      featured: false,
      status: "active",
      views: 54,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await jobs.insertMany(jobSeeds);

  await blogs.insertMany([
    {
      title: "How AI Is Changing Modern Hiring",
      slug: uniqueSlug("How AI Is Changing Modern Hiring"),
      description: "A practical look at AI resume scoring, matching, and recruiter workflows.",
      content:
        "Artificial intelligence is transforming recruiting from keyword filters into contextual matching. HireGenius AI combines profile signals, skills graphs, and conversational coaching so candidates and recruiters move faster with better decisions.",
      author: "Ava Admin",
      authorId: adminResult.insertedId,
      tags: ["AI", "Hiring", "Career"],
      published: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Building an ATS-Friendly Resume in 2026",
      slug: uniqueSlug("Building an ATS-Friendly Resume in 2026"),
      description: "Structure, keywords, and proof points that still win interviews.",
      content:
        "ATS-friendly resumes emphasize clarity, quantified outcomes, and role-aligned skills. Use clean section headings, avoid complex tables, and mirror language from the job description without keyword stuffing.",
      author: "Casey Candidate",
      tags: ["Resume", "Tips"],
      published: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Remote Interview Playbook for Candidates",
      slug: uniqueSlug("Remote Interview Playbook for Candidates"),
      description: "Preparation rituals that calm nerves and highlight your strengths.",
      content:
        "Treat remote interviews like product demos: prepare your environment, rehearse stories with STAR, and keep a concise project narrative ready. Follow up with a short thank-you summarizing mutual fit.",
      author: "Ryan Recruiter",
      tags: ["Interview", "Remote"],
      published: true,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  logger.info("Seed completed");
  logger.info("Accounts: admin@hiregenius.ai / recruiter@hiregenius.ai / candidate@hiregenius.ai");
  logger.info("Password for all: Password123!");

  await disconnectDatabase();
}

seed().catch(async (error) => {
  logger.error("Seed failed", error);
  await disconnectDatabase();
  process.exit(1);
});
