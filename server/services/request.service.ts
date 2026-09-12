import { db } from "@/lib/db";
import { writeAuditLog } from "@/server/audit/write";
import { AuthorizationError } from "@/server/permissions/errors";
import { findOwnRequest, listAdminRequests, listManagerRequests, listOwnRequests } from "@/server/repositories/request.repository";
import type { CreateRequestInput, ReviewRequestInput } from "@/server/validators/request";

export class RequestNotFoundError extends Error {}

export async function getOwnRequests(userId: string) { return listOwnRequests(userId); }
export async function getOwnRequest(userId: string, requestId: string) {
  const item = await findOwnRequest(userId, requestId);
  if (!item) throw new RequestNotFoundError("Request not found");
  return item;
}
export async function createOwnRequest(userId: string, input: CreateRequestInput) {
  return db.$transaction(async (tx) => {
    const item = await tx.request.create({ data: { userId, title: input.title, description: input.description } });
    await writeAuditLog(tx, { actorId: userId, action: "REQUEST_SUBMITTED", targetType: "Request", targetId: item.id });
    return item;
  });
}
export async function cancelOwnRequest(userId: string, requestId: string) {
  return db.$transaction(async (tx) => {
    const item = await tx.request.findFirst({ where: { id: requestId, userId } });
    if (!item) throw new RequestNotFoundError("Request not found");
    if (item.status !== "SUBMITTED") throw new AuthorizationError("Only submitted requests can be cancelled");
    const updated = await tx.request.update({ where: { id: requestId }, data: { status: "CANCELLED" } });
    await writeAuditLog(tx, { actorId: userId, action: "REQUEST_CANCELLED", targetType: "Request", targetId: requestId });
    return updated;
  });
}
export async function getManagerRequests(managerId: string) { return listManagerRequests(managerId); }
export async function reviewAssignedRequest(managerId: string, input: ReviewRequestInput) {
  return db.$transaction(async (tx) => {
    const item = await tx.request.findUnique({ where: { id: input.requestId }, select: { id: true, userId: true, status: true } });
    if (!item) throw new RequestNotFoundError("Request not found");
    const assignment = await tx.managerAssignment.findUnique({ where: { managerId_userId: { managerId, userId: item.userId } }, select: { id: true } });
    if (!assignment) throw new AuthorizationError("Request owner is outside the manager's scope");
    if (item.status !== "SUBMITTED") throw new AuthorizationError("Request is no longer pending review");
    const updated = await tx.request.update({ where: { id: item.id }, data: { status: input.decision, reviewNote: input.reviewNote || null, reviewedById: managerId, reviewedAt: new Date() } });
    await writeAuditLog(tx, { actorId: managerId, action: input.decision === "APPROVED" ? "REQUEST_APPROVED" : "REQUEST_REJECTED", targetType: "Request", targetId: item.id, metadata: { ownerId: item.userId } });
    return updated;
  });
}
export async function getAdminRequests() { return listAdminRequests(); }
