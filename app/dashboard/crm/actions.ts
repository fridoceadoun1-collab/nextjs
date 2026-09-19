"use server";

import { revalidatePath } from "next/cache";
import { createProspect, updateProspect } from "@/lib/store";
import type { ProspectStatus } from "@/lib/types";

export async function addProspectAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await createProspect({
    name,
    email: String(formData.get("email") ?? "").trim() || undefined,
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    interest: String(formData.get("interest") ?? "").trim() || undefined,
    source: "manuel",
  });

  revalidatePath("/dashboard/crm");
}

export async function updateProspectStatusAction(id: string, status: ProspectStatus) {
  await updateProspect(id, { status, touchContact: true });
  revalidatePath("/dashboard/crm");
}

export async function addProspectNoteAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  if (!id || !note) return;

  await updateProspect(id, { addNote: note });
  revalidatePath("/dashboard/crm");
}
