import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";

const CONTACT_EMAIL = "hello@campuscapital.app";
const UPDATED = "July 8, 2026";

export const metadata: Metadata = {
  title: "Terms of Service · Campus Capital",
  description: "The terms for using Campus Capital, an educational money app.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-bold tracking-tight text-white">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-white/70">{children}</div>
    </section>
  );
}

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-sm text-white/45">Last updated {UPDATED}</p>
          </div>
        </div>

        <div className="mt-10 space-y-9">
          <p className="text-[15px] leading-relaxed text-white/70">
            Welcome to Campus Capital. By creating an account or using the app, you agree
            to these terms. Please read them, they are short and written in plain language.
          </p>

          <Section title="What Campus Capital is">
            <p>
              Campus Capital is an educational product that teaches money, investing,
              startups, and career skills through lessons, quizzes, and simulations.
              Everything is for learning. There is no real money, no real trading, and no
              brokerage account anywhere in the app.
            </p>
          </Section>

          <Section title="Not financial advice">
            <p>
              Nothing in the app is financial, investment, tax, or legal advice, and
              nothing is a recommendation to buy or sell any real security. Simulated
              results are illustrations for learning and do not predict real outcomes.
              Always do your own research and consider a licensed professional before
              making real financial decisions.
            </p>
          </Section>

          <Section title="Your account">
            <p>
              You are responsible for keeping your login secure and for activity under
              your account. Provide accurate information when you sign up, and let us know
              if you believe your account has been compromised. The app is intended for
              students and others age 13 and older.
            </p>
          </Section>

          <Section title="Acceptable use">
            <p>
              Use the app for its intended, lawful, educational purpose. Do not attempt to
              break, overload, reverse-engineer, or abuse the service, scrape or misuse
              other students&apos; information, or post content that is harmful, illegal, or
              infringing.
            </p>
          </Section>

          <Section title="Content and ownership">
            <p>
              The lessons, design, and software are owned by Campus Capital and provided
              for your personal, educational use. Notes and projects you create belong to
              you. Market data shown in the simulator is provided by third parties and is
              for educational use only.
            </p>
          </Section>

          <Section title="Disclaimers and limitation of liability">
            <p>
              The app is provided &quot;as is&quot; without warranties of any kind. We do
              our best to keep it accurate and available, but we cannot guarantee it will
              be error-free or uninterrupted. To the fullest extent permitted by law,
              Campus Capital is not liable for any losses arising from your use of the app,
              including any real financial decisions you make.
            </p>
          </Section>

          <Section title="Changes and termination">
            <p>
              We may update these terms or the app over time; when we update the terms we
              will change the date above. We may suspend or end access that violates these
              terms. You can stop using the app at any time.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about these terms? Email us at{" "}
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
            <Link href="/privacy" className="text-capital-300 hover:underline">
              Privacy Policy
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
