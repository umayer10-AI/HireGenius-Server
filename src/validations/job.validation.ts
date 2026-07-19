import { z } from "zod";
import { objectIdSchema, paginationSchema, salarySchema } from "./common.validation.js";

export const createJobSchema = z.object({
  companyId: objectIdSchema,
  title: z.string().min(3).max(150),
  shortDescription: z.string().min(20).max(300),
  description: z.string().min(50).max(20000),
  requirements: z.array(z.string()).min(1),
  responsibilities: z.array(z.string()).min(1),
  benefits: z.array(z.string()).default([]),
  skills: z.array(z.string()).min(1),
  salary: salarySchema,
  currency: z.string().default("USD"),
  experience: z.string().min(1),
  category: z.string().min(1),
  jobType: z.enum(["full-time", "part-time", "contract", "internship", "freelance"]),
  workMode: z.enum(["remote", "onsite", "hybrid"]),
  location: z.string().min(1),
  vacancies: z.number().int().min(1).default(1),
  applicationDeadline: z.coerce.date(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "active", "closed", "expired"]).default("active"),
});

export const updateJobSchema = createJobSchema.partial();

export const jobQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  location: z.string().optional(),
  experience: z.string().optional(),
  jobType: z.string().optional(),
  workMode: z.string().optional(),
  companyId: objectIdSchema.optional(),
  company: z.string().optional(),
  minSalary: z.coerce.number().optional(),
  maxSalary: z.coerce.number().optional(),
  featured: z.coerce.boolean().optional(),
  status: z.enum(["draft", "active", "closed", "expired", "all"]).optional(),
  skills: z.string().optional(),
  createdBy: objectIdSchema.optional(),
  mine: z.coerce.boolean().optional(),
});

export const jobIdParamSchema = z.object({
  id: z.string().min(1),
});
