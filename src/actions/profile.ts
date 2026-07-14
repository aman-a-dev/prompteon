"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Update user profile (name, bio, image).
 */
export async function updateProfile(prevState: any, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const image = formData.get("image") as string;

  const updateData: Partial<{ name: string; bio: string; image: string }> = {};
  if (name) updateData.name = name;
  if (bio) updateData.bio = bio;
  if (image) updateData.image = image;

  if (Object.keys(updateData).length === 0) {
    return { error: "No fields to update" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  });

  return { success: true };
}

/**
 * Delete the current user's account.
 */
export async function deleteAccount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.user.delete({
    where: { id: session.user.id },
  });

  redirect("/");
}
