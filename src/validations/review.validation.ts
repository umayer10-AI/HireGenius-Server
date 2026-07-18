import { z } from "zod";
import { objectIdSchema, paginationSchema } from "./common.validation";

export const createReviewSchema = z.object({
  companyId: objectIdSchema,
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(2000),
});

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(10).max(2000).optional(),
});

export const reviewQuerySchema = paginationSchema.extend({
  companyId: objectIdSchema.optional(),
});

export const reviewIdParamSchema = z.object({
  id: objectIdSchema,
});
