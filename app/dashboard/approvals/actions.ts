"use server";

import { revalidatePath } from "next/cache";
import { resolveEscalation } from "@/lib/store";
import type { EscalationStatus } from "@/lib/types";

export async function resolveEscalationAction(id: string, status: EscalationStatus, note?: string) {
  await resolveEscalation(id, status, note);
  revalidatePath("/dashboard/approvals");
}
