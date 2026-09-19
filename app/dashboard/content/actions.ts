"use server";

import { revalidatePath } from "next/cache";
import { createPost, listPosts } from "@/lib/store";
import { publishToSocial } from "@/lib/social";
import type { SocialPlatform } from "@/lib/types";

export async function addPostAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const platforms = formData.getAll("platforms") as SocialPlatform[];
  const scheduledFor = String(formData.get("scheduledFor") ?? "").trim();
  const productRef = String(formData.get("productRef") ?? "").trim();

  if (!title || !body || platforms.length === 0) return;

  await createPost({
    title,
    body,
    platforms,
    scheduledFor: scheduledFor || undefined,
    productRef: productRef || undefined,
  });

  revalidatePath("/dashboard/content");
}

export async function publishNowAction(id: string) {
  const post = (await listPosts()).find((p) => p.id === id);
  if (!post) return;
  await publishToSocial(post);
  revalidatePath("/dashboard/content");
}
