import { db } from "@/lib/db";
import { writeAuditLog } from "@/server/audit/write";
import { hashPassword } from "@/server/auth/password";
import {
  ADMIN_USERS_PAGE_SIZE,
  findAdminUserById,
  listAdminUsers,
  listEligibleManagers,
} from "@/server/repositories/admin-user.repository";
import {
  adminUserListQuerySchema,
  type AdminCreateUserInput,
} from "@/server/validators/admin-user";

export class AdminManagementError extends Error {
  constructor(
    message: string,
    readonly code: "NOT_FOUND" | "CONFLICT" | "LAST_ADMIN" | "SELF_CHANGE" | "INVALID_ASSIGNMENT",
  ) {
    super(message);
    this.name = "AdminManagementError";
  }
}

export async function getAdminUsers(rawQuery: Partial<Record<string, string | string[] | undefined>>) {
  const query = adminUserListQuerySchema.parse({
    page: Array.isArray(rawQuery.page) ? rawQuery.page[0] : rawQuery.page,
    q: Array.isArray(rawQuery.q) ? rawQuery.q[0] : rawQuery.q,
    role: Array.isArray(rawQuery.role) ? rawQuery.role[0] : rawQuery.role,
    status: Array.isArray(rawQuery.status) ? rawQuery.status[0] : rawQuery.status,
  });
  const result = await listAdminUsers(query);
  return {
    ...result,
    query,
    pageSize: ADMIN_USERS_PAGE_SIZE,
    pages: Math.max(1, Math.ceil(result.total / ADMIN_USERS_PAGE_SIZE)),
  };
}

export async function getAdminUserDetail(userId: string) {
  const [user, managers] = await Promise.all([findAdminUserById(userId), listEligibleManagers()]);
  if (!user) throw new AdminManagementError("User not found", "NOT_FOUND");
  return { user, managers };
}

export async function createManagedUser(actorId: string, input: AdminCreateUserInput) {
  const passwordHash = await hashPassword(input.password);
  try {
    return await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          passwordHash,
          role: input.role,
          status: input.status,
        },
        select: { id: true, email: true },
      });
      await writeAuditLog(tx, { actorId, action: "ADMIN_USER_CREATED", targetType: "User", targetId: user.id, metadata: { role: input.role, status: input.status } });
      return user;
    });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
      throw new AdminManagementError("An account with that email already exists", "CONFLICT");
    }
    throw error;
  }
}

export async function updateManagedUserProfile(actorId: string, userId: string, firstName: string, lastName: string) {
  const existing = await db.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!existing) throw new AdminManagementError("User not found", "NOT_FOUND");
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { firstName, lastName } }),
    writeAuditLog(db, { actorId, action: "ADMIN_USER_PROFILE_UPDATED", targetType: "User", targetId: userId, metadata: { changedFields: ["firstName", "lastName"] } }),
  ]);
}

export async function changeManagedUserRole(actorId: string, targetUserId: string, role: "USER" | "MANAGER" | "ADMIN") {
  await db.$transaction(async (tx) => {
    const target = await tx.user.findUnique({ where: { id: targetUserId }, select: { role: true, status: true } });
    if (!target) throw new AdminManagementError("User not found", "NOT_FOUND");
    if (target.role === role) return;
    if (actorId === targetUserId) throw new AdminManagementError("Administrators cannot change their own role", "SELF_CHANGE");
    if (target.role === "ADMIN" && target.status === "ACTIVE" && role !== "ADMIN") {
      const otherActiveAdmins = await tx.user.count({ where: { id: { not: targetUserId }, role: "ADMIN", status: "ACTIVE" } });
      if (otherActiveAdmins === 0) throw new AdminManagementError("The final active administrator cannot be demoted", "LAST_ADMIN");
    }
    const before = target;
    if (!before) throw new AdminManagementError("User not found", "NOT_FOUND");
    await tx.user.update({ where: { id: targetUserId }, data: { role, authVersion: { increment: 1 } } });
    if (role !== "MANAGER") await tx.managerAssignment.deleteMany({ where: { managerId: targetUserId } });
    if (role !== "USER") await tx.managerAssignment.deleteMany({ where: { userId: targetUserId } });
    await writeAuditLog(tx, { actorId, action: "ADMIN_ROLE_CHANGED", targetType: "User", targetId: targetUserId, metadata: { from: before.role, to: role } });
  }, { isolationLevel: "Serializable" });
}

export async function changeManagedUserStatus(actorId: string, targetUserId: string, status: "ACTIVE" | "INACTIVE" | "SUSPENDED") {
  await db.$transaction(async (tx) => {
    const target = await tx.user.findUnique({ where: { id: targetUserId }, select: { role: true, status: true } });
    if (!target) throw new AdminManagementError("User not found", "NOT_FOUND");
    if (target.status === status) return;
    if (actorId === targetUserId && status !== "ACTIVE") throw new AdminManagementError("Administrators cannot disable their own account", "SELF_CHANGE");
    if (target.role === "ADMIN" && target.status === "ACTIVE" && status !== "ACTIVE") {
      const otherActiveAdmins = await tx.user.count({ where: { id: { not: targetUserId }, role: "ADMIN", status: "ACTIVE" } });
      if (otherActiveAdmins === 0) throw new AdminManagementError("The final active administrator cannot be disabled", "LAST_ADMIN");
    }
    const before = target;
    await tx.user.update({ where: { id: targetUserId }, data: { status, authVersion: { increment: 1 } } });
    await writeAuditLog(tx, { actorId, action: "ADMIN_STATUS_CHANGED", targetType: "User", targetId: targetUserId, metadata: { from: before.status, to: status } });
  }, { isolationLevel: "Serializable" });
}

export async function assignManager(actorId: string, managerId: string, userId: string) {
  if (managerId === userId) throw new AdminManagementError("A manager cannot be assigned to themselves", "INVALID_ASSIGNMENT");
  await db.$transaction(async (tx) => {
    const [manager, user] = await Promise.all([
      tx.user.findUnique({ where: { id: managerId }, select: { role: true, status: true } }),
      tx.user.findUnique({ where: { id: userId }, select: { role: true } }),
    ]);
    if (!manager || !user) throw new AdminManagementError("User not found", "NOT_FOUND");
    if (manager.role !== "MANAGER" || manager.status !== "ACTIVE") throw new AdminManagementError("Selected manager is not an active manager", "INVALID_ASSIGNMENT");
    if (user.role !== "USER") throw new AdminManagementError("Only USER accounts can be assigned to managers", "INVALID_ASSIGNMENT");
    await tx.managerAssignment.upsert({
      where: { managerId_userId: { managerId, userId } },
      create: { managerId, userId },
      update: {},
    });
    await writeAuditLog(tx, { actorId, action: "ADMIN_MANAGER_ASSIGNED", targetType: "User", targetId: userId, metadata: { managerId } });
  });
}

export async function removeManagerAssignment(actorId: string, managerId: string, userId: string) {
  await db.$transaction(async (tx) => {
    await tx.managerAssignment.deleteMany({ where: { managerId, userId } });
    await writeAuditLog(tx, { actorId, action: "ADMIN_MANAGER_UNASSIGNED", targetType: "User", targetId: userId, metadata: { managerId } });
  });
}
