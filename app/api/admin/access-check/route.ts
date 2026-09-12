import { NextResponse } from "next/server";
import { requirePermission } from "@/server/permissions/guards";
import { authorizationErrorResponse } from "@/server/permissions/http";
import { PERMISSIONS } from "@/server/permissions/permissions";

export async function GET() {
  try {
    const user = await requirePermission(PERMISSIONS.ADMIN_READ_USERS);
    return NextResponse.json({ allowed: true, userId: user.id });
  } catch (error) {
    const response = authorizationErrorResponse(error);
    if (response) return response;

    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Unable to authorize request" } },
      { status: 500 },
    );
  }
}
