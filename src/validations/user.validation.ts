import { z } from "zod";
import { objectIdSchema, paginationSchema } from "./common.validation.js";

const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startYear: z.number().int().min(1950).max(2100),
  endYear: z.number().int().min(1950).max(2100).optional(),
  description: z.string().optional(),
});

const experienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(1),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(30).optional(),
  bio: z.string().max(2000).optional(),
  skills: z.array(z.string()).optional(),
  experienceYears: z.number().min(0).max(60).optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  portfolio: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  location: z.string().max(200).optional(),
  role: z.enum(["admin", "recruiter", "candidate"]).optional(),
  isPremium: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  notificationPreferences: z
    .object({
      email: z.boolean(),
      push: z.boolean(),
      applicationUpdates: z.boolean(),
      interviewUpdates: z.boolean(),
      marketing: z.boolean(),
    })
    .optional(),
  privacy: z
    .object({
      publicProfile: z.boolean(),
      hideEmail: z.boolean(),
      hidePhone: z.boolean(),
    })
    .optional(),
});

export const userQuerySchema = paginationSchema.extend({
  role: z.enum(["admin", "recruiter", "candidate"]).optional(),
});

export const userIdParamSchema = z.object({
  id: objectIdSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});
