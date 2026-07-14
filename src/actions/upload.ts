"use server";

import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function uploadFile(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  // Validate file size (e.g., 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File too large (max 10MB)");
  }

  const extension = file.name.split(".").pop() || "bin";
  const filename = `${session.user.id}/${Date.now()}.${extension}`;

  const blob = await put(filename, file, {
    access: "public",
    contentType: file.type,
  });

  // Determine type for UI
  let type = "other";
  if (file.type.startsWith("image/")) type = "image";
  else if (file.type.startsWith("video/")) type = "video";
  else if (file.type.startsWith("audio/")) type = "audio";

  return { url: blob.url, type };
}
