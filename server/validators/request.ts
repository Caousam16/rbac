import { z } from "zod";

export const createRequestSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(5000),
}).strict();

export const reviewRequestSchema = z.object({
  requestId: z.string().cuid(),
  decision: z.enum(["APPROVED", "REJECTED"]),
  reviewNote: z.string().trim().max(1000).optional().default(""),
}).strict();

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type ReviewRequestInput = z.infer<typeof reviewRequestSchema>;
