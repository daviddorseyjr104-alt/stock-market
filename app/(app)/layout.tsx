import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { MobileNav } from "@/components/shell/MobileNav";
import { AppGate } from "@/components/shell/AppGate";
import { OnboardingGate } from "@/components/shell/OnboardingGate";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppGate>
      <OnboardingGate>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="flex-1 px-4 pb-28 pt-6 sm:px-6 lg:pb-10">
              <div className="mx-auto w-full max-w-6xl">{children}</div>
            </main>
          </div>
          <MobileNav />
        </div>
      </OnboardingGate>
    </AppGate>
  );
}
