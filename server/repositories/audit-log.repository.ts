import { db } from "@/lib/db";
import type { AuditLogQuery } from "@/server/validators/audit-log";

export const AUDIT_LOG_PAGE_SIZE = 25;

function buildWhere(query: AuditLogQuery) {
  const createdAt = {
    ...(query.from ? { gte: new Date(`${query.from}T00:00:00.000Z`) } : {}),
    ...(query.to ? { lte: new Date(`${query.to}T23:59:59.999Z`) } : {}),
  };

  return {
    ...(query.action ? { action: { contains: query.action, mode: "insensitive" as const } } : {}),
    ...(query.targetType ? { targetType: { contains: query.targetType, mode: "insensitive" as const } } : {}),
    ...(query.from || query.to ? { createdAt } : {}),
    ...(query.q ? {
      OR: [
        { actor: { is: { email: { contains: query.q, mode: "insensitive" as const } } } },
        { actor: { is: { firstName: { contains: query.q, mode: "insensitive" as const } } } },
        { actor: { is: { lastName: { contains: query.q, mode: "insensitive" as const } } } },
        { targetId: { contains: query.q, mode: "insensitive" as const } },
      ],
    } : {}),
  };
}

export async function listAuditLogs(query: AuditLogQuery) {
  const where = buildWhere(query);
  const [rows, total] = await db.$transaction([
    db.auditLog.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (query.page - 1) * AUDIT_LOG_PAGE_SIZE,
      take: AUDIT_LOG_PAGE_SIZE,
      select: {
        id: true,
        action: true,
        targetType: true,
        targetId: true,
        metadata: true,
        createdAt: true,
        actor: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    }),
    db.auditLog.count({ where }),
  ]);
  return { rows, total, pageSize: AUDIT_LOG_PAGE_SIZE };
}
