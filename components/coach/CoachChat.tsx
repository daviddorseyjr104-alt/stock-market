"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Bot,
  Briefcase,
  HelpCircle,
  LineChart,
  Presentation,
  Rocket,
  Send,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getCoachResponse, suggestedPrompts, type CoachReply } from "@/lib/coach";
import { springSoft, staggerContainer, fadeUp } from "@/lib/motion";
import { useAppState } from "@/lib/store";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Role = "user" | "coach";

interface ChatMessage {
  id: string;
  role: Role;
  /** Coach replies render as separate paragraphs; user messages use one entry. */
  answer: string[];
  /** For coach replies: the question that produced this answer (note title). */
  question?: string;
  /** Topic active when the question was asked (note topic). */
  topic?: string;
  recommendedLessonId?: string;
  recommendedLabel?: string;
  saved?: boolean;
  /** Quota / degradation message to show alongside the answer. */
  notice?: string;
  /** True when the built-in engine answered instead of a live model. */
  offline?: boolean;
}

export interface CoachTopic {
  id: string;
  label: string;
  icon: LucideIcon;
  starter: string;
}

export const COACH_TOPICS: CoachTopic[] = [
  { id: "lesson-help", label: "Lesson help", icon: BookOpen, starter: "Can you re-explain compound interest from my lesson in a simpler way?" },
  { id: "startup", label: "Startup", icon: Rocket, starter: "How do student founders usually fund their first startup idea?" },
  { id: "investing", label: "Investing", icon: LineChart, starter: "What is an ETF and why do beginners start there?" },
  { id: "career", label: "Career", icon: Briefcase, starter: "What should I do with my internship paycheck?" },
  { id: "pitch-feedback", label: "Pitch feedback", icon: Presentation, starter: "Here's my one-line pitch, what makes a student pitch land with judges?" },
  { id: "explain-term", label: "Explain a term", icon: HelpCircle, starter: "Explain what diversification means like I'm brand new to this." },
];

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "coach",
  answer: [
    "Hey, I'm Capital Coach, your AI money tutor. 👋",
    "Ask me anything about investing, budgeting, startups, or what to do with your first paycheck, in plain student language. I'll keep it simple and point you to a lesson when it helps.",
    "Pick a topic, tap a suggested question, or just type your own.",
  ],
};

let idCounter = 0;
const nextId = () => `m-${Date.now()}-${idCounter++}`;

export function CoachChat({ className }: { className?: string }) {
  const { addCoachNote } = useAppState();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to the newest message / typing indicator.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || thinking) return;

    const activeTopic =
      COACH_TOPICS.find((t) => t.id === topic)?.label ?? "General";

    setMessages((prev) => [...prev, { id: nextId(), role: "user", answer: [trimmed] }]);
    setInput("");
    setThinking(true);
    track("coach_question", { source: "coach_page", topic: activeTopic });

    // Try the API route (which upgrades to a live model when a key exists),
    // but always fall back to the offline engine, the coach works with no keys.
    let reply: CoachReply;
    let notice: string | undefined;
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const payload = (await res.json()) as CoachReply & { error?: string };

      // 401/403 (not signed in / unverified) carry no answer — say so plainly
      // rather than serving a canned reply as if the tutor had responded.
      if (res.status === 401 || res.status === 403) {
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "coach", answer: [payload.error ?? "You need a confirmed account to ask Coach."] },
        ]);
        setThinking(false);
        return;
      }

      reply =
        Array.isArray(payload.answer) && payload.answer.length > 0
          ? payload
          : getCoachResponse(trimmed);
      // 429 = daily quota spent; the offline answer still comes back with it.
      notice = payload.error;
    } catch {
      reply = { ...getCoachResponse(trimmed), source: "offline" };
    }

    // Only pace instant (offline) replies; a live call already took real time.
    if (reply.source !== "live") await new Promise((r) => setTimeout(r, 650));

    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "coach",
        answer: reply.answer,
        question: trimmed,
        topic: activeTopic,
        recommendedLessonId: reply.recommendedLessonId,
        recommendedLabel: reply.recommendedLabel,
        notice,
        offline: reply.source === "offline",
      },
    ]);
    setThinking(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void ask(input);
  }

  function pickTopic(t: CoachTopic) {
    setTopic((prev) => (prev === t.id ? null : t.id));
    setInput(t.starter);
    inputRef.current?.focus();
  }

  function saveNote(m: ChatMessage) {
    if (m.saved) return;
    addCoachNote({
      title: m.question ?? m.answer[0]?.slice(0, 80) ?? "Coach note",
      body: m.answer.join("\n\n"),
      topic: m.topic ?? "General",
    });
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, saved: true } : x)));
  }

  const showSuggestions = messages.filter((m) => m.role === "user").length < 2;

  return (
    <Card className={cn("glass-hi flex min-h-0 flex-1 flex-col p-0", className)}>
      {/* ── Topic quick-filters ─────────────────────────────────── */}
      <div className="border-b border-white/10 px-3 py-2.5 sm:px-4">
        <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex w-max gap-1.5"
          >
            {COACH_TOPICS.map((t) => {
              const active = topic === t.id;
              const Icon = t.icon;
              return (
                <motion.button
                  key={t.id}
                  variants={fadeUp}
                  type="button"
                  onClick={() => pickTopic(t)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    active
                      ? "border-capital-400/40 bg-capital-400/10 text-capital-300 shadow-glow-soft"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── Thread ─────────────────────────────────────────────── */}
      <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain bg-aurora px-4 py-5 sm:px-6">
        <AnimatePresence initial={false}>
          {messages.map((m) =>
            m.role === "user" ? (
              <UserBubble key={m.id} text={m.answer[0]} />
            ) : (
              <CoachBubble key={m.id} message={m} onSave={() => saveNote(m)} />
            ),
          )}
        </AnimatePresence>

        {thinking && <TypingIndicator />}

        {showSuggestions && !thinking && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="pl-0 sm:pl-12"
          >
            <motion.p
              variants={fadeUp}
              className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-white/40"
            >
              <Sparkles className="h-3.5 w-3.5 text-capital-300/70" />
              Suggested questions
            </motion.p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {suggestedPrompts.map((prompt) => (
                <motion.button
                  key={prompt}
                  variants={fadeUp}
                  type="button"
                  onClick={() => void ask(prompt)}
                  className="sheen group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/80 transition-all hover:border-capital-400/40 hover:bg-capital-400/5 hover:text-white"
                >
                  <span>{prompt}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:text-capital-300" />
                </motion.button>
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
              ref={inputRef}
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
              className="max-h-32 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/35 transition-colors focus:border-capital-400/40 focus:outline-none focus:ring-focus"
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
        <p className="mt-2 hidden px-1 text-[11px] text-white/30 sm:block">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </div>
    </Card>
  );
}

/* ── Bubbles ──────────────────────────────────────────────────────────── */

function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={springSoft}
      className="flex justify-end"
    >
      <div className="max-w-[85%] rounded-3xl rounded-br-md border border-capital-400/25 bg-gradient-to-br from-capital-400/[0.14] to-violet-500/[0.10] px-4 py-3 text-sm leading-relaxed text-white shadow-glow-soft sm:max-w-[75%]">
        {text}
      </div>
    </motion.div>
  );
}

function CoachBubble({ message, onSave }: { message: ChatMessage; onSave: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={springSoft}
      className="flex items-start gap-3"
    >
      <BotAvatar />
      <div className="min-w-0 max-w-[85%] space-y-3 sm:max-w-[78%]">
        <div className="space-y-2.5 rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-relaxed text-white/85 shadow-card">
          {message.answer.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {message.notice && (
          <p
            role="status"
            className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] px-3 py-2 text-xs leading-relaxed text-amber-200"
          >
            {message.notice}
          </p>
        )}

        {message.id !== "welcome" && (
          <div className="flex flex-wrap items-center gap-2.5">
            {message.recommendedLessonId && message.recommendedLabel && (
              <Card hover className="flex w-full items-center justify-between gap-3 rounded-2xl border-capital-400/15 bg-capital-400/[0.04] p-3 sm:w-auto">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-capital-300/80">
                    Recommended next
                  </p>
                  <p className="truncate text-sm font-medium text-white">
                    {message.recommendedLabel}
                  </p>
                </div>
                <Button
                  href={`/learn/lesson/${message.recommendedLessonId}`}
                  size="sm"
                  variant="secondary"
                  className="shrink-0"
                >
                  Open
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Card>
            )}

            <SaveNoteButton saved={Boolean(message.saved)} onSave={onSave} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/** "Save as note" with a springy success pop once the note is stored. */
function SaveNoteButton({ saved, onSave }: { saved: boolean; onSave: () => void }) {
  return (
    <div className="relative">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onSave}
        aria-pressed={saved}
        className={cn(saved && "pointer-events-none text-capital-300")}
      >
        <AnimatePresence mode="wait" initial={false}>
          {saved ? (
            <motion.span
              key="saved"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springSoft}
              className="inline-flex items-center gap-2"
            >
              <BookmarkCheck className="h-4 w-4" />
              Saved to notes
            </motion.span>
          ) : (
            <motion.span
              key="save"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2"
            >
              <Bookmark className="h-4 w-4" />
              Save as note
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
      {/* One-shot sparkle burst on save. */}
      <AnimatePresence>
        {saved && (
          <motion.span
            key="burst"
            initial={{ opacity: 0, scale: 0.4, y: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 1.4], y: [-2, -14, -22] }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 text-capital-300"
            aria-hidden
          >
            <Sparkles className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function BotAvatar({ breathing }: { breathing?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-capital-gradient text-ink-950 shadow-glow",
        breathing && "animate-breathe",
      )}
    >
      <Bot className="h-5 w-5" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-start gap-3"
    >
      <BotAvatar breathing />
      <div className="flex items-center gap-2 rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.05] px-4 py-3.5">
        <span className="text-xs text-white/40">Coach is thinking</span>
        <span className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-capital-300"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
            />
          ))}
        </span>
      </div>
    </motion.div>
  );
}
