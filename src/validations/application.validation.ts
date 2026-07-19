import { z } from "zod";
import { objectIdSchema, paginationSchema } from "./common.validation.js";

export const createApplicationSchema = z.object({
  jobId: objectIdSchema,
  resume: z.string().url().optional(),
  coverLetter: z.string().max(10000).optional(),
  expectedSalary: z.number().min(0).optional(),
  portfolio: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
});

export const updateApplicationSchema = z.object({
  status: z
    .enum([
      "Applied",
      "Reviewed",
      "Shortlisted",
      "Interview Scheduled",
      "Accepted",
      "Rejected",
    ])
    .optional(),
  notes: z.string().max(5000).optional(),
  coverLetter: z.string().max(10000).optional(),
  expectedSalary: z.number().min(0).optional(),
});

export const applicationQuerySchema = paginationSchema.extend({
  status: z.string().optional(),
  jobId: objectIdSchema.optional(),
  candidateId: objectIdSchema.optional(),
});

export const applicationIdParamSchema = z.object({
  id: objectIdSchema,
});
