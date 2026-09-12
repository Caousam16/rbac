"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "@/server/auth/require-auth";
import { updateOwnProfile } from "@/server/services/user.service";
import { updateOwnProfileSchema } from "@/server/validators/user";

export async function updateOwnProfileAction(formData: FormData) {
  const user = await requireAuth();
  const parsed = updateOwnProfileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!parsed.success) redirect("/account/profile?error=invalid_input");

  await updateOwnProfile(user.id, parsed.data);
  redirect("/account/profile?updated=1");
}
