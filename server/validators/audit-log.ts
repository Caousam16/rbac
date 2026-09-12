import { z } from "zod";

const optionalDate = z.string().trim().refine((value) => value === "" || !Number.isNaN(Date.parse(value)), "Invalid date");

export const auditLogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  q: z.string().trim().max(120).default(""),
  action: z.string().trim().max(100).default(""),
  targetType: z.string().trim().max(100).default(""),
  from: optionalDate.default(""),
  to: optionalDate.default(""),
}).strict();

export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>;
