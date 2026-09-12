import { db } from "@/lib/db";

export const REQUEST_PAGE_SIZE = 20;

export function listOwnRequests(userId: string) {
  return db.request.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: REQUEST_PAGE_SIZE,
    select: { id: true, title: true, status: true, createdAt: true, updatedAt: true },
  });
}

export function findOwnRequest(userId: string, requestId: string) {
  return db.request.findFirst({
    where: { id: requestId, userId },
    select: { id: true, title: true, description: true, status: true, reviewNote: true, reviewedAt: true, createdAt: true, updatedAt: true },
  });
}

export function listManagerRequests(managerId: string) {
  return db.request.findMany({
    where: { user: { userAssignments: { some: { managerId } } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: REQUEST_PAGE_SIZE,
    select: { id: true, title: true, status: true, createdAt: true, user: { select: { id: true, firstName: true, lastName: true, email: true } } },
  });
}

export function listAdminRequests() {
  return db.request.findMany({
    orderBy: { createdAt: "desc" },
    take: REQUEST_PAGE_SIZE,
    select: { id: true, title: true, status: true, createdAt: true, user: { select: { id: true, firstName: true, lastName: true, email: true } }, reviewedBy: { select: { firstName: true, lastName: true } } },
  });
}
