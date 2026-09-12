import { sanitizeAuditMetadata } from "@/server/audit/presentation";
import { listAuditLogs } from "@/server/repositories/audit-log.repository";
import { auditLogQuerySchema } from "@/server/validators/audit-log";

export async function getAuditLogBrowser(rawQuery: Partial<Record<string, string | string[] | undefined>>) {
  const pick = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const query = auditLogQuerySchema.parse({
    page: pick(rawQuery.page), q: pick(rawQuery.q), action: pick(rawQuery.action),
    targetType: pick(rawQuery.targetType), from: pick(rawQuery.from), to: pick(rawQuery.to),
  });
  const result = await listAuditLogs(query);
  return {
    ...result,
    query,
    rows: result.rows.map((row) => ({ ...row, metadata: sanitizeAuditMetadata(row.metadata) })),
    pages: Math.max(1, Math.ceil(result.total / result.pageSize)),
  };
}
