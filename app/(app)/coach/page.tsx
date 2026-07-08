"use client";

import { AnimatePresence, motion } from "framer-motion";
import { NotebookPen, Sparkles, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { CoachChat } from "@/components/coach/CoachChat";
import { springSoft } from "@/lib/motion";
import { useAppState } from "@/lib/store";
import { timeAgo } from "@/lib/utils";

export default function CoachPage() {
  const { hydrated, coachNotes, deleteCoachNote } = useAppState();

  return (
    <div className="space-y-4">
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

      <Disclaimer>
        <strong className="font-semibold text-white/60">
          Educational, not financial advice.
        </strong>{" "}
        Capital Coach explains concepts in student-friendly language to help you
        learn. It never gives personalized investment advice, always do your own
        research before investing real money.
      </Disclaimer>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start">
        {/* ── Chat ─────────────────────────────────────────────── */}
        <CoachChat className="h-[calc(100dvh-19rem)] min-h-[30rem]" />

        {/* ── Saved notes rail ─────────────────────────────────── */}
        <Card className="xl:sticky xl:top-6 xl:max-h-[calc(100dvh-9rem)] xl:overflow-y-auto">
          <CardHeader
            title="Saved notes"
            subtitle={
              hydrated
                ? `${coachNotes.length} saved from the coach`
                : "Loading…"
            }
            icon={<NotebookPen className="h-4 w-4" />}
          />

          {!hydrated ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : coachNotes.length === 0 ? (
            <EmptyState
              icon={<NotebookPen className="h-7 w-7" />}
              title="No saved notes yet"
              description="Tap “Save as note” under any coach answer and it will land here for later."
            />
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {coachNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={springSoft}
                    className="sheen card-lift group relative rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="mb-1.5 flex items-center gap-2 pr-8">
                      <Pill tone="capital">{note.topic}</Pill>
                      <span className="text-xs text-white/35">
                        {timeAgo(note.createdAt)} ago
                      </span>
                    </div>
                    <p className="pr-6 text-sm font-semibold leading-snug text-white">
                      {note.title}
                    </p>
                    <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-white/55">
                      {note.body}
                    </p>
                    <button
                      type="button"
                      onClick={() => deleteCoachNote(note.id)}
                      className="absolute right-3 top-3 rounded-lg p-1.5 text-white/25 transition hover:bg-white/5 hover:text-rose-400 focus-visible:ring-focus"
                      aria-label={`Delete note: ${note.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
