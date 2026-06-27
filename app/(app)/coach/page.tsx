"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bookmark, BookmarkCheck, Bot, Send, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { suggestedPrompts, type CoachReply } from "@/lib/coach";
import { cn } from "@/lib/utils";

type Role = "user" | "coach";

interface ChatMessage {
  id: string;
  role: Role;
  /** Coach replies render as separate paragraphs; user messages use one entry. */
  answer: string[];
  recommendedLessonId?: string;
  recommendedLabel?: string;
  saved?: boolean;
  error?: boolean;
}

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "coach",
  answer: [
    "Hey, I'm Capital Coach, your AI money tutor. 👋",
    "Ask me anything about investing, budgeting, Roth IRAs, or what to do with your first paycheck, in plain student language. I'll keep it simple and point you to a lesson when it helps.",
    "Tap a question below to get started, or just type your own.",
  ],
};

let idCounter = 0;
const nextId = () => `m-${Date.now()}-${idCounter++}`;

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const threadRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message / typing indicator.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || thinking) return;

    const userMessage: ChatMessage = {
      id: nextId(),
      role: "user",
      answer: [trimmed],
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setThinking(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const reply = (await res.json()) as CoachReply;

      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "coach",
          answer: reply.answer,
          recommendedLessonId: reply.recommendedLessonId,
          recommendedLabel: reply.recommendedLabel,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "coach",
          error: true,
          answer: [
            "Hmm, I couldn't reach the coach just now. That's on me, not you.",
            "Give it another try in a moment, or pick one of the suggested questions.",
          ],
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void ask(input);
  }

  function toggleSaved(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, saved: !m.saved } : m)),
    );
  }

  // Show suggested questions while the conversation is still short.
  const showSuggestions = messages.filter((m) => m.role === "user").length < 2;

  return (
    <div className="flex h-[calc(100vh-9rem)] min-h-[34rem] flex-col">
      <PageHeader
        title="Capital Coach"
        subtitle="Ask anything about money, in plain student language."
        action={
          <Pill tone="violet">
            <Sparkles className="h-3.5 w-3.5" />
            AI Tutor
          </Pill>
        }
      />

      <Disclaimer className="mb-4">
        <strong className="font-semibold text-white/60">
          Educational, not financial advice.
        </strong>{" "}
        Capital Coach explains concepts in student-friendly language to help you
        learn. It never gives personalized investment advice, always do your own
        research before investing real money.
      </Disclaimer>

      <Card className="flex min-h-0 flex-1 flex-col p-0">
        {/* ── Thread ─────────────────────────────────────────────── */}
        <div
          ref={threadRef}
          className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6"
        >
          <AnimatePresence initial={false}>
            {messages.map((m) =>
              m.role === "user" ? (
                <UserBubble key={m.id} text={m.answer[0]} />
              ) : (
                <CoachBubble
                  key={m.id}
                  message={m}
                  onToggleSaved={() => toggleSaved(m.id)}
                />
              ),
            )}
          </AnimatePresence>

          {thinking && <TypingIndicator />}

          {/* Suggested-question cards while the thread is short. */}
          {showSuggestions && !thinking && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="pl-0 sm:pl-12"
            >
              <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-white/40">
                <Sparkles className="h-3.5 w-3.5" />
                Suggested questions
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void ask(prompt)}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/80 transition-all hover:border-capital-400/40 hover:bg-capital-400/5 hover:text-white"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:text-capital-300" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Input bar (pinned) ─────────────────────────────────── */}
        <div className="border-t border-white/10 bg-white/[0.02] p-3 sm:p-4">
          <form onSubmit={handleSubmit} className="flex items-end gap-2.5">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void ask(input);
                  }
                }}
                rows={1}
                placeholder="Ask Capital Coach anything about money..."
                aria-label="Ask Capital Coach a question"
                className="max-h-32 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-capital-400/40 focus:outline-none focus:ring-focus"
              />
            </div>
            <Button
              type="submit"
              size="md"
              disabled={!input.trim() || thinking}
              className="h-[46px] px-4"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
          <p className="mt-2 px-1 text-[11px] text-white/30">
            Press Enter to send · Shift + Enter for a new line
          </p>
        </div>
      </Card>
    </div>
  );
}

/* ── Bubbles ──────────────────────────────────────────────────────────── */

function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex justify-end"
    >
      <div className="glass-strong max-w-[85%] rounded-3xl rounded-br-lg px-4 py-3 text-sm leading-relaxed text-white sm:max-w-[75%]">
        {text}
      </div>
    </motion.div>
  );
}

function CoachBubble({
  message,
  onToggleSaved,
}: {
  message: ChatMessage;
  onToggleSaved: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex items-start gap-3"
    >
      <BotAvatar />
      <div className="min-w-0 max-w-[85%] space-y-3 sm:max-w-[78%]">
        <div
          className={cn(
            "space-y-2.5 rounded-3xl rounded-tl-lg px-4 py-3 text-sm leading-relaxed",
            message.error
              ? "border border-rose-500/20 bg-rose-500/5 text-white/80"
              : "border border-white/10 bg-white/[0.04] text-white/85",
          )}
        >
          {message.answer.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Recommended lesson + save action (only on real answers). */}
        {!message.error && (
          <div className="flex flex-wrap items-center gap-2.5">
            {message.recommendedLessonId && message.recommendedLabel && (
              <Card className="flex w-full items-center justify-between gap-3 rounded-2xl border-capital-400/15 bg-capital-400/[0.04] p-3 sm:w-auto">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-capital-300/80">
                    Recommended next
                  </p>
                  <p className="truncate text-sm font-medium text-white">
                    {message.recommendedLabel}
                  </p>
                </div>
                <Button
                  href={`/learn/${message.recommendedLessonId}`}
                  size="sm"
                  variant="secondary"
                  className="shrink-0"
                >
                  Open
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Card>
            )}

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onToggleSaved}
              aria-pressed={message.saved}
              className={cn(message.saved && "text-capital-300")}
            >
              {message.saved ? (
                <>
                  <BookmarkCheck className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  Save answer
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function BotAvatar() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-capital-gradient text-ink-950 shadow-glow">
      <Bot className="h-5 w-5" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
    >
      <BotAvatar />
      <div className="flex items-center gap-2 rounded-3xl rounded-tl-lg border border-white/10 bg-white/[0.04] px-4 py-3.5">
        <span className="text-xs text-white/40">Coach is thinking</span>
        <span className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-capital-300"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
            />
          ))}
        </span>
      </div>
    </motion.div>
  );
}
