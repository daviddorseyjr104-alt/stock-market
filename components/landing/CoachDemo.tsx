"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Bot, Send, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

const SUGGESTIONS = [
  "I only have $50. Should I invest?",
  "What should I do with internship money?",
  "How do Roth IRAs work?",
];

interface Exchange {
  q: string;
  answer: string[] | null; // null = still thinking
}

function BotAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-capital-gradient">
      <Bot className="h-4 w-4 text-ink-950" />
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-capital-300"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

export function CoachDemo() {
  const [input, setInput] = useState("");
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const [busy, setBusy] = useState(false);

  async function ask(raw: string) {
    const question = raw.trim();
    if (!question || busy) return;
    setBusy(true);
    setInput("");
    setExchange({ q: question, answer: null });
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = (await res.json()) as { answer?: string[] };
      setExchange({ q: question, answer: data.answer?.length ? data.answer : ["Try asking that another way."] });
    } catch {
      setExchange({
        q: question,
        answer: ["I couldn't reach the coach just now. Give it another try in a moment."],
      });
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void ask(input);
  }

  return (
    <Card className="p-5">
      <div className="min-h-[176px] space-y-3">
        {!exchange ? (
          <div className="flex max-w-[90%] gap-2.5">
            <BotAvatar />
            <div className="rounded-2xl rounded-bl-md bg-capital-400/[0.06] px-4 py-3 text-sm leading-relaxed text-white/80">
              Hey! Ask me anything about money in plain student language, try one below or type your own. This is the real Capital Coach.
            </div>
          </div>
        ) : (
          <>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-white/8 px-4 py-2.5 text-sm text-white">
              {exchange.q}
            </div>
            <div className="flex max-w-[92%] gap-2.5">
              <BotAvatar />
              <div className="space-y-2 rounded-2xl rounded-bl-md bg-capital-400/[0.06] px-4 py-3 text-sm leading-relaxed text-white/80">
                {exchange.answer === null ? (
                  <TypingDots />
                ) : (
                  exchange.answer.map((p, i) => <p key={i}>{p}</p>)
                )}
              </div>
            </div>
            {exchange.answer && (
              <div className="pl-10">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-capital-300 hover:underline"
                >
                  Get your own Capital Coach <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            disabled={busy}
            className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-xs text-white/55 transition-colors hover:border-capital-400/40 hover:text-white disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] py-1 pl-4 pr-1 focus-within:border-capital-400/40"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about money…"
          aria-label="Ask Capital Coach"
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || busy}
          aria-label="Send"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-capital-gradient text-ink-950 transition-all hover:brightness-110 disabled:pointer-events-none disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </Card>
  );
}
