"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { AnimatedImageShader } from "@/components/animated-image-shader";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-black text-white">
      <motion.div
        className="absolute inset-0 -z-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Image
          src="/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] sm:object-center"
        />
        <AnimatedImageShader
          src="/hero.webp"
          className="absolute inset-0 size-full"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black/50 to-transparent"
        />
      </motion.div>

      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-[1440px] flex-col px-6 pb-10 pt-16 sm:pb-14 sm:pt-20 lg:px-10 lg:pb-16 lg:pt-24">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.h1
            custom={0.05}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-4xl text-[clamp(1.75rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-tight"
          >
            Transforming Complex Business Challenges into AI Software Solutions
          </motion.h1>

          <motion.h2
            custom={0.14}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-5 max-w-2xl text-4xl font-medium leading-snug text-white/90 sm:text-xl"
          >
             Driving your business growth with exceptional speed and exceptional
             quality, at competitive pricing.
          </motion.h2>

          <motion.div
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8"
          >
            <Button
              className="h-11 rounded-none bg-[#F0C41A] px-7 text-sm font-bold tracking-[0.14em] text-black hover:bg-[#F0C41A]/90"
            >
              TALK TO A SOLUTION EXPERT
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
