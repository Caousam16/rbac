import type { Prisma, PrismaClient } from "@/generated/prisma/client";

export type AuditMetadata = Prisma.InputJsonObject;
type AuditClient = Pick<PrismaClient, "auditLog">;

export function writeAuditLog(
  client: AuditClient,
  event: {
    actorId?: string | null;
    action: string;
    targetType: string;
    targetId?: string | null;
    metadata?: AuditMetadata;
    ipAddress?: string | null;
  },
) {
  return client.auditLog.create({
    data: {
      actorId: event.actorId ?? null,
      action: event.action,
      targetType: event.targetType,
      targetId: event.targetId ?? null,
      metadata: event.metadata,
      ipAddress: event.ipAddress ?? null,
    },
  });
}
