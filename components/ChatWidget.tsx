"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Bonjour ! Je suis l'assistant virtuel. Comment puis-je vous aider aujourd'hui ?" },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const sessionId = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!sessionId.current) {
    sessionId.current = crypto.randomUUID();
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || pending) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          message: text,
          history: nextMessages,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "Désolé, une erreur est survenue." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Désolé, une erreur est survenue. Réessayez." }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-3 flex h-96 w-80 flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
          <div className="border-b border-black/10 px-4 py-3 text-sm font-semibold dark:border-white/10">
            Assistant
          </div>
          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-lg bg-foreground px-3 py-2 text-background"
                    : "mr-auto max-w-[85%] rounded-lg bg-black/5 px-3 py-2 dark:bg-white/10"
                }
              >
                {m.content}
              </div>
            ))}
            {pending && <div className="mr-auto text-xs text-zinc-500">L&apos;assistant écrit…</div>}
          </div>
          <form
            className="flex gap-2 border-t border-black/10 p-2 dark:border-white/10"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              className="flex-1 rounded-md border border-black/10 bg-transparent px-2 py-1 text-sm outline-none dark:border-white/10"
              placeholder="Votre message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-foreground px-3 py-1 text-sm text-background disabled:opacity-50"
            >
              Envoyer
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background shadow-lg"
      >
        {open ? "Fermer" : "💬 Discuter"}
      </button>
    </div>
  );
}
