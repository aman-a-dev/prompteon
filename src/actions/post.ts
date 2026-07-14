"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cacheTag, revalidateTag } from "next/cache";

type AttachmentInput = {
  type: string;
  url: string;
  caption?: string;
};

// ---------- Read ----------
export async function getAllPosts() {
  "use cache";
  cacheTag("posts");

  const posts = await prisma.post.findMany({
    include: {
      user: { select: { id: true, name: true, image: true } },
      attachments: true,
      _count: {
        select: { likes: true, favorites: true, views: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return posts.map((post) => ({
    ...post,
    id: String(post.id),
    title: post.title ?? undefined,
    description: post.description ?? undefined,
    user: {
      id: post.user.id,
      name: post.user.name,
      image: post.user.image ?? undefined,
    },
    attachments: post.attachments.map((a) => ({
      id: String(a.id),
      url: a.url,
      type: a.type,
      caption: a.caption ?? undefined,
    })),
    likesCount: post._count.likes,
    favoritesCount: post._count.favorites,
    viewsCount: post._count.views,
    commentCount: post._count.comments,
  }));
}

export async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      user: { select: { id: true, name: true, image: true } },
      attachments: true,
      comments: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { likes: true, favorites: true, views: true } },
    },
  });

  if (!post) return null;

  return {
    ...post,
    id: String(post.id),
    title: post.title ?? undefined,
    description: post.description ?? undefined,
    user: {
      id: post.user.id,
      name: post.user.name,
      image: post.user.image ?? undefined,
    },
    attachments: post.attachments.map((a) => ({
      id: String(a.id),
      url: a.url,
      type: a.type,
      caption: a.caption ?? undefined,
    })),
    likesCount: post._count.likes,
    favoritesCount: post._count.favorites,
    viewsCount: post._count.views,
  };
}

// ---------- Write ----------
export async function createPost(prevState: any, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tagsString = formData.get("tags") as string;
  const attachmentsJson = formData.get("attachments") as string;

  if (!title || !description) {
    return { error: "Title and description are required" };
  }

  const tags = tagsString ? tagsString.split(",").map((t) => t.trim()) : [];
  let attachments: AttachmentInput[] = [];
  try {
    attachments = attachmentsJson ? JSON.parse(attachmentsJson) : [];
  } catch {
    // ignore invalid JSON
  }

  const newPost = await prisma.post.create({
    data: {
      title,
      description,
      tags,
      userId: session.user.id,
      isPublished: true,
      publishedAt: new Date(),
      status: "PUBLISHED",
      attachments: {
        create: attachments.map((a) => ({
          type: a.type,
          url: a.url,
          caption: a.caption ?? null,
        })),
      },
    },
  });

  revalidateTag("posts", "max");
  return { success: true, postId: String(newPost.id) };
}

export async function updatePost(prevState: any, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  if (!id) throw new Error("Post ID is required");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tagsString = formData.get("tags") as string;
  const attachmentsJson = formData.get("attachments") as string;

  const tags = tagsString ? tagsString.split(",").map((t) => t.trim()) : [];
  let attachments: AttachmentInput[] = [];
  try {
    attachments = attachmentsJson ? JSON.parse(attachmentsJson) : [];
  } catch {
    // ignore invalid JSON
  }

  // Verify ownership
  const existing = await prisma.post.findUnique({
    where: { id: parseInt(id, 10) },
    select: { userId: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    throw new Error("Not authorized to edit this post");
  }

  // Replace attachments: delete existing and create new ones
  const updated = await prisma.$transaction(async (tx) => {
    await tx.attachment.deleteMany({ where: { postId: parseInt(id, 10) } });
    return tx.post.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        description,
        tags,
        updatedAt: new Date(),
        attachments: {
          create: attachments.map((a) => ({
            type: a.type,
            url: a.url,
            caption: a.caption ?? null,
          })),
        },
      },
    });
  });

  revalidateTag("posts", "max");
  return { success: true, postId: String(updated.id) };
}

export async function deletePost(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await prisma.post.findUnique({
    where: { id: parseInt(id, 10) },
    select: { userId: true, title: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    throw new Error("Not authorized to delete this post");
  }

  const deleted = await prisma.post.delete({
    where: { id: parseInt(id, 10) },
    select: { title: true },
  });

  revalidateTag("posts", "max");
  return deleted.title;
}
