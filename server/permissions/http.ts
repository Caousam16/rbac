import { NextResponse } from "next/server";
import { AuthenticationError } from "@/server/auth/errors";
import { AuthorizationError } from "@/server/permissions/errors";

export function authorizationErrorResponse(error: unknown) {
  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      { error: { code: error.code, message: "Authentication required" } },
      { status: error.status },
    );
  }

  if (error instanceof AuthorizationError) {
    return NextResponse.json(
      { error: { code: error.code, message: "Forbidden" } },
      { status: error.status },
    );
  }

  return null;
}
