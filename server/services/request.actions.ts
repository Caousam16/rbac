"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/server/permissions/guards";
import { PERMISSIONS } from "@/server/permissions/permissions";
import { createOwnRequest, cancelOwnRequest, reviewAssignedRequest } from "@/server/services/request.service";
import { createRequestSchema, reviewRequestSchema } from "@/server/validators/request";

export async function createRequestAction(formData: FormData) {
  const user = await requirePermission(PERMISSIONS.RECORD_CREATE);
  const input = createRequestSchema.parse({ title: formData.get("title"), description: formData.get("description") });
  const item = await createOwnRequest(user.id, input);
  redirect(`/requests/${item.id}`);
}
export async function cancelRequestAction(formData: FormData) {
  const user = await requirePermission(PERMISSIONS.RECORD_DELETE_OWN);
  const requestId = String(formData.get("requestId") ?? "");
  await cancelOwnRequest(user.id, requestId);
  revalidatePath("/requests"); revalidatePath(`/requests/${requestId}`);
}
export async function reviewRequestAction(formData: FormData) {
  const manager = await requirePermission(PERMISSIONS.MANAGER_APPROVE_RECORD);
  const input = reviewRequestSchema.parse({ requestId: formData.get("requestId"), decision: formData.get("decision"), reviewNote: formData.get("reviewNote") ?? "" });
  await reviewAssignedRequest(manager.id, input);
  revalidatePath("/manager"); revalidatePath("/manager/requests");
}
