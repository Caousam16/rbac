import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RBAC Platform",
  description: "Production-ready role-based application foundation",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
