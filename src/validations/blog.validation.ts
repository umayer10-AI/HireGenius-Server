import { z } from "zod";
import { objectIdSchema, paginationSchema } from "./common.validation";

export const createBlogSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(500),
  content: z.string().min(50),
  image: z.string().url().optional(),
  author: z.string().min(2),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(true),
});

export const updateBlogSchema = createBlogSchema.partial();

export const blogQuerySchema = paginationSchema.extend({
  tag: z.string().optional(),
  published: z.coerce.boolean().optional(),
});

export const blogIdParamSchema = z.object({
  id: objectIdSchema,
});

export const blogSlugParamSchema = z.object({
  slug: z.string().min(1),
});
