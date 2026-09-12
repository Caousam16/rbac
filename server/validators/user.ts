import { z } from "zod";

const personName = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(80, "Name is too long")
  .regex(/^[\p{L}\p{M}'’ .-]+$/u, "Name contains unsupported characters");

export const updateOwnProfileSchema = z
  .object({
    firstName: personName,
    lastName: personName,
  })
  .strict();

export type UpdateOwnProfileInput = z.infer<typeof updateOwnProfileSchema>;
