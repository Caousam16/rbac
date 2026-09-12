import type { AppRole, Permission } from "@/server/permissions/permissions";
import { hasPermission } from "@/server/permissions/permissions";
import { AuthorizationError } from "@/server/permissions/errors";

export type AuthorizationPrincipal = {
  id: string;
  role: AppRole;
};

export function assertRole(
  principal: AuthorizationPrincipal,
  allowedRoles: readonly AppRole[],
): void {
  if (!allowedRoles.includes(principal.role)) {
    throw new AuthorizationError();
  }
}

export function assertPermission(
  principal: AuthorizationPrincipal,
  permission: Permission,
): void {
  if (!hasPermission(principal.role, permission)) {
    throw new AuthorizationError();
  }
}

export function assertOwnership(
  principal: AuthorizationPrincipal,
  resourceOwnerId: string,
): void {
  if (principal.id !== resourceOwnerId) {
    throw new AuthorizationError("Resource does not belong to the authenticated user");
  }
}
