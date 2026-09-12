import { NextResponse } from "next/server";
import { requireAuth } from "@/server/auth/require-auth";

export async function GET() {
  try {
    const user = await requireAuth();
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: { code: "UNAUTHENTICATED", message: "Authentication required" } }, { status: 401 });
  }
}
