import { z } from "zod";

export const adminRoleSchema = z.enum(["USER", "MANAGER", "ADMIN"]);
export const accountStatusSchema = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);

const nameField = z.string().trim().min(1).max(100);

export const adminUserListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  q: z.string().trim().max(120).default(""),
  role: z.enum(["ALL", "USER", "MANAGER", "ADMIN"]).default("ALL"),
  status: z.enum(["ALL", "ACTIVE", "INACTIVE", "SUSPENDED"]).default("ALL"),
});

export const adminCreateUserSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(12).max(128).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  role: adminRoleSchema,
  status: accountStatusSchema,
}).strict();

export const adminUpdateProfileSchema = z.object({
  userId: z.string().cuid(),
  firstName: nameField,
  lastName: nameField,
}).strict();

export const adminChangeRoleSchema = z.object({
  userId: z.string().cuid(),
  role: adminRoleSchema,
}).strict();

export const adminChangeStatusSchema = z.object({
  userId: z.string().cuid(),
  status: accountStatusSchema,
}).strict();

export const managerAssignmentSchema = z.object({
  managerId: z.string().cuid(),
  userId: z.string().cuid(),
}).strict();

export type AdminUserListQuery = z.infer<typeof adminUserListQuerySchema>;
export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
