import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

const cols = [
  {
    title: "Product",
    links: [
      { label: "Learn", href: "/learn" },
      { label: "Simulator", href: "/simulator" },
      { label: "Campus", href: "/campus" },
      { label: "Leaderboards", href: "/leaderboards" },
      { label: "Capital Coach", href: "/coach" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Clubs", href: "/clubs" },
      { label: "Challenges", href: "/challenges" },
      { label: "Your Profile", href: "/profile" },
      { label: "Sign up", href: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Mission", href: "/#network" },
      { label: "For Universities", href: "/#network" },
      { label: "Partnerships", href: "/#network" },
      { label: "Log in", href: "/login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/8 px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_2fr]">
          <div>
            <Logo size="lg" />
            <p className="mt-4 max-w-sm text-sm text-white/50">
              Investing education built for students before they have money. Learn
              the market through the life you actually live.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {cols.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  {col.title}
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-white/60 transition-colors hover:text-capital-300"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4 text-xs leading-relaxed text-white/40">
          <strong className="text-white/55">Educational only, not financial advice.</strong>{" "}
          Campus Capital is an educational platform. It involves no real money and
          no real trading. All portfolios are simulated. Nothing here is a
          recommendation to buy or sell any security. Students should always do
          their own research before investing real money.
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} Campus Capital. Built for the next generation of investors.</p>
          <p>Investing education built for students before they have money.</p>
        </div>
      </div>
    </footer>
  );
}
