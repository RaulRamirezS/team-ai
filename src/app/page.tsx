import { AiChangeSection } from "@/components/ai-change-section";
import { AiPromptSection } from "@/components/ai-prompt-section";
import { FaqSection } from "@/components/faq-section";
import { HeroSection } from "@/components/hero-section";
import { HomePageNumbers } from "@/components/home-page-numbers";
import { InformationSecurityStudioPageProvider } from "@/components/information-security-studio-page-provider";
import { StepperSection } from "@/components/stepper-section";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <AiPromptSection />
      <AiChangeSection />
      <StepperSection />
      <HomePageNumbers />
      <InformationSecurityStudioPageProvider />
      <FaqSection />
    </main>
  );
}
