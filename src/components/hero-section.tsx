"use client";

import { motion } from "framer-motion";

import HomeVisual from "@/components/home-visual";
import ShaderBackground from "@/components/shader-background";
import { GlowButton } from "@/components/ui/glow-button";

// Layout, aurora shader background, isometric visual and glow button are ported
// from the TEAM Solutions site home hero. Copy is this site's existing content.
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: "easeOut" as const },
  }),
};

const PROOF = [
  { value: "20+", label: "years of enterprise technology delivery" },
  {
    value: "ISO 27001",
    label: "ISO/IEC 27001:2022 certified at all locations",
  },
  { value: "Claude", label: "Certified Services Partner (Anthropic)" },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black">
      <ShaderBackground />

      <div className="relative mx-auto w-full max-w-[1280px] px-6 py-20 md:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.h1
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-6 max-w-5xl text-balance text-[1.75rem] font-bold leading-[2.5rem] text-white lg:text-[2.75rem] lg:leading-[3.25rem]"
            >
              Transforming Complex Business Challenges into AI Software Solutions
            </motion.h1>
            <motion.h2
              custom={0.15}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-white/70 md:text-[1.0625rem] md:leading-7"
            >
              Driving your business growth with exceptional speed and exceptional
              quality, at competitive pricing.
            </motion.h2>
            <motion.div
              custom={0.3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <GlowButton href="#find-solutions">TALK TO A SOLUTION EXPERT</GlowButton>
            </motion.div>
          </div>

          <HomeVisual />
        </div>

        <motion.ul
          custom={0.45}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-12 grid w-full grid-cols-1 gap-4 md:mt-16 md:grid-cols-3"
        >
          {PROOF.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-[#9C9299]/40 bg-white/[0.08] px-6 py-4 text-left shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl"
            >
              <span className="shrink-0 text-[22px] font-bold leading-none text-[#FDBE00]">
                {item.value}
              </span>
              <span className="text-xs leading-snug text-white/60">
                {item.label}
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
