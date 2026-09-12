import { requireAuth } from "@/server/auth/require-auth";
import { AuthorizationError } from "@/server/permissions/errors";
import {
  assertOwnership,
  assertPermission,
  assertRole,
} from "@/server/permissions/authorize";
import type { AppRole, Permission } from "@/server/permissions/permissions";
import { managerHasUserAssignment } from "@/server/repositories/manager-assignment.repository";

export async function requireRole(...allowedRoles: readonly AppRole[]) {
  const user = await requireAuth();
  assertRole(user, allowedRoles);
  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireAuth();
  assertPermission(user, permission);
  return user;
}

export async function requireOwnership(resourceOwnerId: string) {
  const user = await requireAuth();
  assertOwnership(user, resourceOwnerId);
  return user;
}

export async function requireManagerScope(targetUserId: string) {
  const user = await requireAuth();
  assertRole(user, ["MANAGER"]);

  const assignment = await managerHasUserAssignment(user.id, targetUserId);
  if (!assignment) {
    throw new AuthorizationError("User is outside the manager's assigned scope");
  }

  return user;
}
