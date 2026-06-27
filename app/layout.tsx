import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/lib/store/AppStateProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Campus Capital, Investing education built for students",
    template: "%s · Campus Capital",
  },
  description:
    "Campus Capital teaches investing through student life, internships, rent, financial aid, side hustles, scholarships, student debt, and first paychecks. Learn the market through the life you actually live.",
  keywords: [
    "investing for students",
    "college investing",
    "financial literacy",
    "Roth IRA",
    "ETFs",
    "campus finance",
  ],
  openGraph: {
    title: "Campus Capital",
    description: "Investing education built for students before they have money.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} dark`}>
      <body className="app-backdrop min-h-screen font-sans antialiased">
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
