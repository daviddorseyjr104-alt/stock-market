import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCoachResponse, type CoachReply } from "@/lib/coach";

export const runtime = "nodejs";

// Capital Coach API.
//
// • With ANTHROPIC_API_KEY set, answers are generated live by Claude
//   (claude-opus-4-8 by default; override with CC_COACH_MODEL).
// • Without a key, it falls back to the built-in offline knowledge engine.
// In both cases the response shape is identical (CoachReply), and a relevant
// lesson recommendation is attached from the local lesson catalog.

const MODEL = process.env.CC_COACH_MODEL ?? "claude-opus-4-8";

const SYSTEM_PROMPT = `You are Capital Coach, the AI tutor inside Campus Capital, an investing-education app for college students.

Your job: explain money and investing to students in plain, encouraging language, grounded in real student life (financial aid, part-time jobs, internships, rent, scholarships, student debt, first paychecks, first Roth IRA).

Rules:
- Be warm, clear, and concise. 2-4 short paragraphs maximum. No jargon walls.
- Use student-life analogies whenever helpful.
- This is EDUCATION, not financial advice. Never tell a student to buy or sell a specific security, and never present a guess as a guarantee. When relevant, gently remind them this is educational and to do their own research.
- No real-money trading happens in this app; portfolios are simulated.
- Respond directly with your answer only, do not include meta-commentary, headers, or a restatement of the question.`;

export async function POST(req: Request) {
  let question = "";
  try {
    const body = (await req.json()) as { question?: unknown };
    if (typeof body.question === "string") question = body.question.trim();
  } catch {
    // Malformed/empty body, falls through to the friendly fallback reply.
  }

  if (!question) return NextResponse.json(getCoachResponse(""));

  // The lesson recommendation always comes from the local catalog (deterministic).
  const offline = getCoachResponse(question);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json(offline);

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: question }],
    });

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (!text) return NextResponse.json(offline);

    const answer = text
      .split(/\n{2,}/)
      .map((p) => p.replace(/\n/g, " ").trim())
      .filter(Boolean);

    const reply: CoachReply = {
      answer: answer.length ? answer : [text],
      recommendedLessonId: offline.recommendedLessonId,
      recommendedLabel: offline.recommendedLabel,
    };
    return NextResponse.json(reply);
  } catch (err) {
    // Any API failure (rate limit, network, refusal) → graceful offline answer.
    console.error("Capital Coach live call failed, using offline engine:", err);
    return NextResponse.json(offline);
  }
}
