import { NextResponse } from "next/server";
import { AuthenticationError } from "@/server/auth/errors";
import { requireAuth } from "@/server/auth/require-auth";
import { getOwnProfile, updateOwnProfile } from "@/server/services/user.service";
import { updateOwnProfileSchema } from "@/server/validators/user";

function unauthenticated() {
  return NextResponse.json(
    { error: { code: "UNAUTHENTICATED", message: "Authentication required" } },
    { status: 401 },
  );
}

export async function GET() {
  try {
    const user = await requireAuth();
    const profile = await getOwnProfile(user.id);
    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof AuthenticationError) return unauthenticated();
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Unable to load profile" } },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  let user;
  try {
    user = await requireAuth();
  } catch (error) {
    if (error instanceof AuthenticationError) return unauthenticated();
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Unable to authenticate request" } },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } },
      { status: 400 },
    );
  }

  const parsed = updateOwnProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Profile data is invalid",
          fields: parsed.error.flatten().fieldErrors,
        },
      },
      { status: 400 },
    );
  }

  try {
    const profile = await updateOwnProfile(user.id, parsed.data);
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Unable to update profile" } },
      { status: 500 },
    );
  }
}
