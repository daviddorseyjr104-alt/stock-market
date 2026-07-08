import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";

// Update this to a support address you actually monitor before publishing.
const CONTACT_EMAIL = "hello@campuscapital.app";
const UPDATED = "July 8, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy · Campus Capital",
  description: "How Campus Capital collects, uses, and protects your information.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-bold tracking-tight text-white">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-white/70">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="app-backdrop min-h-screen">
      <div className="mx-auto max-w-2xl px-5 py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campus Capital
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white">
              Privacy Policy
            </h1>
            <p className="text-sm text-white/45">Last updated {UPDATED}</p>
          </div>
        </div>

        <div className="mt-10 space-y-9">
          <p className="text-[15px] leading-relaxed text-white/70">
            Campus Capital is an educational app that teaches students about money,
            investing, and building a career. Everything in the app is simulated: there
            is no real money, no real trading, and no brokerage account. This policy
            explains what information we collect, why, and the choices you have.
          </p>

          <Section title="Information we collect">
            <p>
              <strong className="text-white/85">Account details you provide</strong> when
              you sign up, such as your name, email address, school, major, graduation
              year, and the interests and goals you select during onboarding.
            </p>
            <p>
              <strong className="text-white/85">Learning activity</strong> you generate by
              using the app: lessons completed, quiz answers, XP, streaks, badges,
              certificates, daily-goal progress, and the notes you save.
            </p>
            <p>
              <strong className="text-white/85">Simulator inputs</strong> you enter into
              the practice tools (budgets, mock portfolios, and other what-if scenarios),
              which stay tied to your account.
            </p>
            <p>
              <strong className="text-white/85">Basic usage analytics</strong> (for
              example, which pages load and general performance) to keep the app fast and
              reliable.
            </p>
          </Section>

          <Section title="How we use your information">
            <p>
              We use it to run the app: to save your progress, power your dashboard,
              show your standing on leaderboards, personalize what you learn next, and
              improve the product. We do not use it to give personalized financial advice,
              and nothing in the app is a recommendation to buy or sell any real security.
            </p>
          </Section>

          <Section title="What we never do">
            <p>
              We do not sell your personal information. We do not process real money,
              execute real trades, or connect to a real brokerage. We do not knowingly
              collect information from children under 13; the app is built for college
              students.
            </p>
          </Section>

          <Section title="Service providers we rely on">
            <p>
              We use a small set of trusted providers to operate the app: a hosting and
              database platform (Supabase) to store your account and progress securely
              behind row-level security, a web host (Vercel) to serve the app, and a
              market-data provider for delayed or live price quotes used only inside the
              simulator (no personal information is sent to it). If an AI tutor is
              enabled, your typed questions may be processed by an AI provider to generate
              a response. These providers process data only to provide their service to us.
            </p>
          </Section>

          <Section title="Data retention and your choices">
            <p>
              Your progress is stored on your device and, when you are signed in, in your
              account so it follows you across devices. You can log out at any time to
              clear the local copy on a device. To access, correct, or permanently delete
              your account and associated data, email us at{" "}
              <a className="text-capital-300 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>{" "}
              and we will handle your request.
            </p>
          </Section>

          <Section title="Security">
            <p>
              We protect account data with authentication and database row-level security
              so each student can only access their own records. No method of storage or
              transmission is ever perfectly secure, but we take reasonable measures to
              safeguard your information.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this policy as the app evolves. When we do, we will revise the
              date at the top of this page. Continued use of the app after an update means
              you accept the revised policy.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about this policy or your data? Reach us at{" "}
              <a className="text-capital-300 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <div className="border-t border-white/10 pt-6 text-sm text-white/40">
            Campus Capital is educational only. Not financial advice. No real money, no
            real trading. All portfolios are simulated.
          </div>

          <div className="flex gap-4 text-sm">
            <Link href="/terms" className="text-capital-300 hover:underline">
              Terms of Service
            </Link>
            <Link href="/" className="text-white/50 hover:text-white">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
