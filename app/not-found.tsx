import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[400px] bg-radial-glow" />
      <Logo size="lg" />
      <div className="mt-12 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-capital-300 animate-float">
        <Compass className="h-10 w-10" />
      </div>
      <p className="mt-6 font-display text-6xl font-bold text-gradient-capital">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-white">
        This page isn&apos;t on the syllabus.
      </h1>
      <p className="mt-2 max-w-sm text-white/55">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Let&apos;s get you back to learning.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/dashboard">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Button>
        <Button href="/learn" variant="secondary">
          Browse lessons
        </Button>
      </div>
    </main>
  );
}
