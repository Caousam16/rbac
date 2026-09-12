const SENSITIVE_KEY_PATTERN = /(password|token|secret|cookie|session|authorization|credential|hash)/i;
const MAX_DEPTH = 3;
const MAX_KEYS = 30;
const MAX_STRING_LENGTH = 200;

function sanitizeValue(value: unknown, depth: number): unknown {
  if (depth > MAX_DEPTH) return "[truncated]";
  if (value === null || typeof value === "boolean" || typeof value === "number") return value;
  if (typeof value === "string") return value.length > MAX_STRING_LENGTH ? `${value.slice(0, MAX_STRING_LENGTH)}…` : value;
  if (Array.isArray(value)) return value.slice(0, MAX_KEYS).map((item) => sanitizeValue(item, depth + 1));
  if (typeof value !== "object") return String(value);
  const result: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value as Record<string, unknown>).slice(0, MAX_KEYS)) {
    result[key] = SENSITIVE_KEY_PATTERN.test(key) ? "[redacted]" : sanitizeValue(nested, depth + 1);
  }
  return result;
}

export function sanitizeAuditMetadata(metadata: unknown): Record<string, unknown> | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  return sanitizeValue(metadata, 0) as Record<string, unknown>;
}

export function auditActionLabel(action: string): string {
  const known: Record<string, string> = {
    AUTH_REGISTER: "Account registered",
    AUTH_PASSWORD_RESET: "Password reset",
    AUTH_PASSWORD_CHANGED: "Password changed",
    USER_PROFILE_UPDATED: "Profile updated",
    ADMIN_USER_CREATED: "User created",
    ADMIN_USER_PROFILE_UPDATED: "User profile updated",
    ADMIN_ROLE_CHANGED: "Role changed",
    ADMIN_STATUS_CHANGED: "Account status changed",
    ADMIN_MANAGER_ASSIGNED: "Manager assigned",
    ADMIN_MANAGER_UNASSIGNED: "Manager assignment removed",
  };
  return known[action] ?? "System activity";
}
