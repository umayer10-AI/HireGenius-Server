import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().optional().default(""),
  sort: z.string().optional().default("newest"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");

export const salarySchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
});
