import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCoachResponse, type CoachReply } from "@/lib/coach";

export const runtime = "nodejs";

// Capital Coach API.
//
// • With ANTHROPIC_API_KEY set, answers are generated live by Claude.
// • Without a key, it falls back to the built-in offline knowledge engine.
//
// Every live call is billed to OUR key, so this endpoint is metered: a caller
// must be signed in with a confirmed email, and each account gets a fixed number
// of live answers per day. Over the cap, the offline engine still answers — the
// product degrades rather than breaking, but it says so instead of pretending.

const MODEL = process.env.CC_COACH_MODEL ?? "claude-opus-4-8";
const DAILY_LIMIT = Number(process.env.CC_COACH_DAILY_LIMIT ?? 25);
const MAX_QUESTION_CHARS = 600;
const MAX_TOKENS = 700;

const SYSTEM_PROMPT = `You are Capital Coach, the AI tutor inside Campus Capital, an investing-education app for college students.

Your job: explain money and investing to students in plain, encouraging language, grounded in real student life (financial aid, part-time jobs, internships, rent, scholarships, student debt, first paychecks, first Roth IRA).

Rules:
- Be warm, clear, and concise. 2-4 short paragraphs maximum. No jargon walls.
- Use student-life analogies whenever helpful.
- This is EDUCATION, not financial advice. Never tell a student to buy or sell a specific security, and never present a guess as a guarantee. When relevant, gently remind them this is educational and to do their own research.
- No real-money trading happens in this app; portfolios are simulated.
- Only answer questions about money, investing, budgeting, credit, careers, and personal finance. If asked about anything else, briefly say that's outside what you can help with and steer back to money.
- Respond directly with your answer only, do not include meta-commentary, headers, or a restatement of the question.`;

export async function POST(req: Request) {
  let question = "";
  try {
    const body = (await req.json()) as { question?: unknown };
    if (typeof body.question === "string") question = body.question.trim();
  } catch {
    // Malformed/empty body, falls through to the friendly fallback reply.
  }

  if (!question) {
    return NextResponse.json({ ...getCoachResponse(""), source: "offline" });
  }
  if (question.length > MAX_QUESTION_CHARS) {
    question = question.slice(0, MAX_QUESTION_CHARS);
  }

  // The lesson recommendation always comes from the local catalog (deterministic).
  const offline: CoachReply = { ...getCoachResponse(question), source: "offline" };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json(offline);

  // ── Gate + meter ─────────────────────────────────────────────────────────
  // Skipped entirely in keyless demo builds, where there's no auth to check.
  if (isSupabaseConfigured) {
    const supabase = createClient();
    if (!supabase) return NextResponse.json(offline);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Sign in to ask Capital Coach." },
        { status: 401 },
      );
    }
    if (!user.email_confirmed_at) {
      return NextResponse.json(
        { error: "Confirm your email to ask Capital Coach." },
        { status: 403 },
      );
    }

    // Atomic server-side counter (SECURITY DEFINER; see supabase/setup.sql).
    // Returns how many live questions remain today, or -1 if already over.
    const { data: remaining, error: quotaError } = await supabase.rpc(
      "consume_coach_quota",
      { p_limit: DAILY_LIMIT },
    );

    if (quotaError) {
      // Don't hand out unmetered live calls just because the meter is broken.
      console.error("[coach] quota check failed:", quotaError.message);
      return NextResponse.json(offline);
    }

    if (typeof remaining === "number" && remaining < 0) {
      return NextResponse.json(
        {
          ...offline,
          error: `You've used your ${DAILY_LIMIT} Coach questions for today. Here's what the built-in guide says, and your quota resets tomorrow.`,
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      await answer(apiKey, question, offline, Number(remaining)),
    );
  }

  return NextResponse.json(await answer(apiKey, question, offline));
}

async function answer(
  apiKey: string,
  question: string,
  offline: CoachReply,
  remaining?: number,
): Promise<CoachReply> {
  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: question }],
    });

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (!text) return offline;

    const paragraphs = text
      .split(/\n{2,}/)
      .map((p) => p.replace(/\n/g, " ").trim())
      .filter(Boolean);

    return {
      answer: paragraphs.length ? paragraphs : [text],
      recommendedLessonId: offline.recommendedLessonId,
      recommendedLabel: offline.recommendedLabel,
      source: "live",
      remaining,
    };
  } catch (err) {
    // Any API failure (rate limit, network, bad model id) → offline answer.
    // Marked `offline` so the client can say the tutor is degraded rather than
    // dressing a canned keyword reply up as a live one.
    console.error("[coach] live call failed, using offline engine:", err);
    return offline;
  }
}
