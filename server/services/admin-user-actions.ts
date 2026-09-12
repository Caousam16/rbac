"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/server/permissions/guards";
import { PERMISSIONS } from "@/server/permissions/permissions";
import {
  assignManager,
  changeManagedUserRole,
  changeManagedUserStatus,
  createManagedUser,
  removeManagerAssignment,
  updateManagedUserProfile,
} from "@/server/services/admin-user.service";
import {
  adminChangeRoleSchema,
  adminChangeStatusSchema,
  adminCreateUserSchema,
  adminUpdateProfileSchema,
  managerAssignmentSchema,
} from "@/server/validators/admin-user";

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "");
}

export async function createUserAction(formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.ADMIN_CREATE_USER);
  const input = adminCreateUserSchema.parse({
    firstName: text(formData, "firstName"), lastName: text(formData, "lastName"), email: text(formData, "email"),
    password: text(formData, "password"), role: text(formData, "role"), status: text(formData, "status"),
  });
  if (input.role !== "USER") await requirePermission(PERMISSIONS.ADMIN_ASSIGN_ROLE);
  if (input.status !== "ACTIVE") await requirePermission(PERMISSIONS.ADMIN_DISABLE_USER);
  const user = await createManagedUser(actor.id, input);
  revalidatePath("/admin"); revalidatePath("/admin/users");
  redirect(`/admin/users/${user.id}?saved=created`);
}

export async function updateUserProfileAction(formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.ADMIN_UPDATE_USER);
  const input = adminUpdateProfileSchema.parse({ userId: text(formData, "userId"), firstName: text(formData, "firstName"), lastName: text(formData, "lastName") });
  await updateManagedUserProfile(actor.id, input.userId, input.firstName, input.lastName);
  revalidatePath(`/admin/users/${input.userId}`); revalidatePath("/admin/users");
  redirect(`/admin/users/${input.userId}?saved=profile`);
}

export async function changeUserRoleAction(formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.ADMIN_ASSIGN_ROLE);
  const input = adminChangeRoleSchema.parse({ userId: text(formData, "userId"), role: text(formData, "role") });
  await changeManagedUserRole(actor.id, input.userId, input.role);
  revalidatePath(`/admin/users/${input.userId}`); revalidatePath("/admin/users"); revalidatePath("/admin");
  redirect(`/admin/users/${input.userId}?saved=role`);
}

export async function changeUserStatusAction(formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.ADMIN_DISABLE_USER);
  const input = adminChangeStatusSchema.parse({ userId: text(formData, "userId"), status: text(formData, "status") });
  await changeManagedUserStatus(actor.id, input.userId, input.status);
  revalidatePath(`/admin/users/${input.userId}`); revalidatePath("/admin/users"); revalidatePath("/admin");
  redirect(`/admin/users/${input.userId}?saved=status`);
}

export async function assignManagerAction(formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.ADMIN_ASSIGN_MANAGER);
  const input = managerAssignmentSchema.parse({ managerId: text(formData, "managerId"), userId: text(formData, "userId") });
  await assignManager(actor.id, input.managerId, input.userId);
  revalidatePath(`/admin/users/${input.userId}`); revalidatePath("/manager");
  redirect(`/admin/users/${input.userId}?saved=manager`);
}

export async function removeManagerAction(formData: FormData) {
  const actor = await requirePermission(PERMISSIONS.ADMIN_ASSIGN_MANAGER);
  const input = managerAssignmentSchema.parse({ managerId: text(formData, "managerId"), userId: text(formData, "userId") });
  await removeManagerAssignment(actor.id, input.managerId, input.userId);
  revalidatePath(`/admin/users/${input.userId}`); revalidatePath("/manager");
  redirect(`/admin/users/${input.userId}?saved=manager-removed`);
}
