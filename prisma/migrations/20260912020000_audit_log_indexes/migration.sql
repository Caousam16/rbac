-- Improve bounded admin audit-log filtering by action/target type and recency.
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");
CREATE INDEX "AuditLog_targetType_createdAt_idx" ON "AuditLog"("targetType", "createdAt");
