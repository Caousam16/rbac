"use client";

export function ConfirmSubmitButton({
  children,
  message,
  className = "dashboard-action-link",
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
}) {
  return <button type="submit" className={className} onClick={(event) => { if (!window.confirm(message)) event.preventDefault(); }}>{children}</button>;
}
