export function describeAuditAction(action: string): string {
  const labels: Readonly<Record<string, string>> = {
    AUTH_REGISTER: "Account created",
    USER_PROFILE_UPDATED: "Profile updated",
    AUTH_PASSWORD_CHANGED: "Password changed",
    AUTH_PASSWORD_RESET: "Password reset",
    AUTH_ADMIN_BOOTSTRAPPED: "Administrator account activated",
  };

  return labels[action] ?? "Account activity";
}
