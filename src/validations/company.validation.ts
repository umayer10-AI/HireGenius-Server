import { z } from "zod";
import { objectIdSchema, paginationSchema } from "./common.validation";

export const createCompanySchema = z.object({
  companyName: z.string().min(2).max(150),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.string().min(2).max(100),
  companySize: z.string().min(1),
  description: z.string().min(20).max(5000),
  location: z.string().min(2).max(200),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  socialLinks: z
    .object({
      linkedin: z.string().url().optional().or(z.literal("")),
      twitter: z.string().url().optional().or(z.literal("")),
      facebook: z.string().url().optional().or(z.literal("")),
      github: z.string().url().optional().or(z.literal("")),
      website: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
});

export const updateCompanySchema = createCompanySchema.partial();

export const companyQuerySchema = paginationSchema.extend({
  industry: z.string().optional(),
  location: z.string().optional(),
});

export const companyIdParamSchema = z.object({
  id: objectIdSchema,
});
