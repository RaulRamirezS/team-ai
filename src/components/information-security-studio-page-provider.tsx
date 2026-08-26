"use client";

import { ImagesSlider } from "@/components/ui/images-slider";
import { partnerLogos } from "@/lib/partner-logos";

export function InformationSecurityStudioPageProvider() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center bg-[#0F0E0F] px-6 py-10 lg:px-10 lg:py-[3.75rem]">
      <h2 className="max-w-[1440px] text-center text-[1.0625rem] font-bold leading-[1.625rem] text-[#FAF8F9] lg:text-[2.5rem] lg:leading-[3rem]">
        Trusted by global enterprises to protect what matters most
      </h2>
      <div className="flex w-full items-start overflow-x-hidden pb-8 pt-[3.75rem]">
        <ImagesSlider
          items={partnerLogos}
          direction="right"
          speed="normal"
          className="flex items-center gap-8 space-x-0 md:gap-10"
        />
      </div>
    </section>
  );
}
