import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/landing/Footer";
import {
  ProductPreview,
  Problem,
  WhyDifferent,
  CampusNetwork,
  LearningSystem,
  SimulatorSection,
  LeaderboardSection,
  CoachSection,
  VisionSection,
  FinalCTA,
} from "@/components/landing/Sections";

export default function LandingPage() {
  return (
    <main className="relative">
      <LandingNav />
      <Hero />
      <ProductPreview />
      <Problem />
      <WhyDifferent />
      <CampusNetwork />
      <LearningSystem />
      <SimulatorSection />
      <LeaderboardSection />
      <CoachSection />
      <VisionSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
