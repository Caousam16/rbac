import { NextResponse } from "next/server";
import { authorizationErrorResponse } from "@/server/permissions/http";
import { PERMISSIONS } from "@/server/permissions/permissions";
import { requireManagerScope, requirePermission } from "@/server/permissions/guards";
import { findAssignedUserForManager } from "@/server/repositories/manager-assignment.repository";

export async function GET(
  _request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    const actor = await requirePermission(PERMISSIONS.MANAGER_READ_ASSIGNED_USERS);
    await requireManagerScope(userId);

    const profile = (await findAssignedUserForManager(actor.id, userId))?.user ?? null;

    if (!profile) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "User not found" } },
        { status: 404 },
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    const response = authorizationErrorResponse(error);
    if (response) return response;

    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Unable to load user" } },
      { status: 500 },
    );
  }
}
