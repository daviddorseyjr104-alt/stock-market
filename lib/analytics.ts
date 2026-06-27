"use client";

import { track as vercelTrack } from "@vercel/analytics";

/**
 * Product analytics. Wraps Vercel Analytics custom events so the rest of the
 * app can record the funnel that actually matters (signup → learn → trade →
 * post → ask). No-ops safely when analytics isn't available (e.g. local dev).
 *
 * View results in the Vercel dashboard → your project → Analytics.
 */
export type AnalyticsEvent =
  | "signup_completed"
  | "login_demo"
  | "lesson_completed"
  | "quiz_finished"
  | "trade_executed"
  | "post_created"
  | "coach_question"
  | "challenge_started";

export function track(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>,
) {
  try {
    vercelTrack(event, props);
  } catch {
    /* analytics is best-effort; never break the app over a metric */
  }
}
