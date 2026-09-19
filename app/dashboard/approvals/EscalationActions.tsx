"use client";

import { useState, useTransition } from "react";
import { resolveEscalationAction } from "./actions";

export default function EscalationActions({ id }: { id: string }) {
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        placeholder="Note (optionnel)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="flex-1 rounded-md border border-black/10 bg-transparent px-2 py-1 text-sm dark:border-white/10"
      />
      <div className="flex gap-2">
        <button
          disabled={pending}
          onClick={() => startTransition(() => resolveEscalationAction(id, "approuve", note))}
          className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
        >
          Approuver
        </button>
        <button
          disabled={pending}
          onClick={() => startTransition(() => resolveEscalationAction(id, "rejete", note))}
          className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
        >
          Rejeter
        </button>
      </div>
    </div>
  );
}
