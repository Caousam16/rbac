import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/server/repositories/database.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const database = await checkDatabaseConnection();

    return NextResponse.json(
      {
        status: database ? "ok" : "degraded",
        service: "rbac-platform",
        database: database ? "connected" : "unavailable",
      },
      {
        status: database ? 200 : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch {
    return NextResponse.json(
      {
        status: "degraded",
        service: "rbac-platform",
        database: "unavailable",
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
