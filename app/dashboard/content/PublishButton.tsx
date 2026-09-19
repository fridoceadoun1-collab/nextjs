"use client";

import { useTransition } from "react";
import { publishNowAction } from "./actions";

export default function PublishButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => publishNowAction(id))}
      className="rounded-md border border-black/10 px-3 py-1 text-xs font-medium hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/10"
    >
      {pending ? "Publication…" : "Publier maintenant"}
    </button>
  );
}
