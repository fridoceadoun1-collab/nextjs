"use client";

import { useTransition } from "react";
import { updateProspectStatusAction } from "./actions";
import type { ProspectStatus } from "@/lib/types";

const STATUSES: { value: ProspectStatus; label: string }[] = [
  { value: "nouveau", label: "Nouveau" },
  { value: "a_relancer", label: "À relancer" },
  { value: "hesitant", label: "Hésitant" },
  { value: "client", label: "Client" },
  { value: "ancien_client", label: "Ancien client" },
  { value: "perdu", label: "Perdu" },
];

export default function StatusSelect({ id, status }: { id: string; status: ProspectStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      className="rounded-md border border-black/10 bg-transparent px-2 py-1 text-sm dark:border-white/10"
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as ProspectStatus;
        startTransition(() => {
          updateProspectStatusAction(id, next);
        });
      }}
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
