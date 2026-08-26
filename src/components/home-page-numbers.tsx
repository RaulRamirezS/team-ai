"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { AnimatedImageShader } from "@/components/animated-image-shader";
import { getAssetUrl } from "@/lib/assets";

const STATS = [
  {
    start: 0,
    end: 20,
    sign: "+",
    label: "years",
    description: "in business",
  },
  {
    start: 1000,
    end: 1500,
    sign: "+",
    description: "employees globally",
  },
  {
    start: 0,
    end: 4.5,
    decimals: 1,
    label: "years",
    description: "average customer retention rate",
  },
  {
    start: 0,
    end: 11,
    description: "global locations",
  },
] as const;

const COUNTRIES_STAT = {
  start: 0,
  end: 44,
  label: "countries",
  description: "where we deliver innovation",
} as const;

const fadeInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function useInViewOnce<T extends HTMLElement>(threshold = 0.5) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function CounterValue({
  start = 0,
  end,
  decimals = 0,
}: {
  start?: number;
  end: number;
  decimals?: number;
}) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>();
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setValue(start + (end - start) * progress);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [decimals, end, inView, start]);

  return (
    <span ref={ref}>
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value)}
    </span>
  );
}

function CounterCard({
  start,
  end,
  decimals = 0,
  sign,
  label,
  description,
}: {
  start: number;
  end: number;
  decimals?: number;
  sign?: string;
  label?: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-self-center">
      <p className="mb-0">
        <span className="text-3xl font-bold tracking-wider text-[#FDBE00] lg:text-5xl lg:leading-none">
          <CounterValue start={start} end={end} decimals={decimals} />
          {sign}
        </span>
        {label ? (
          <span className="ml-2 text-2xl font-bold text-[#756B72] md:text-2xl">
            {label}
          </span>
        ) : null}
      </p>
      <p className="mb-0 text-center text-base font-normal tracking-wider text-[#2F282D]">
        {description}
      </p>
    </div>
  );
}

export function HomePageNumbers() {
  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden bg-white px-6 py-12 lg:px-10 lg:py-28">
      <Image
        src={getAssetUrl("home/Locations.webp")}
        alt=""
        fill
        quality={80}
        sizes="100vw"
        className="pointer-events-none z-0 object-cover"
      />
      <AnimatedImageShader
        src="/locations.webp"
        tone="light"
        speed={0.35}
        intensity={0.4}
        glow={0.25}
        className="pointer-events-none absolute inset-0 z-0 size-full"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row">
        <div className="flex w-full flex-col justify-center lg:w-1/2">
          <h2 className="text-center text-[1.0625rem] font-bold leading-[1.625rem] text-[#2F282D] lg:text-left lg:text-[2.5rem] lg:leading-[3rem]">
            A global IT solutions company by the numbers
          </h2>
          <p className="mb-0 w-full pt-5 text-center text-[0.9375rem] leading-6 text-[#756B72] md:pt-4 lg:text-left">
            State-of-the-art workspaces across the globe ensure continuous
            delivery of custom software development solutions, leveraging{" "}
            <span className="font-medium text-[#1EC69C] underline">
              offshore and nearshore IT services
            </span>{" "}
            for around-the-clock support and innovation.
          </p>
        </div>

        <div className="overflow-hidden pt-8 text-center lg:w-1/2 lg:pt-0">
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid flex-1 grid-cols-1 gap-x-4 gap-y-10 text-center md:grid-cols-2"
          >
            {STATS.map((stat) => (
              <CounterCard key={stat.description} {...stat} />
            ))}
          </motion.div>
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center justify-center pt-8 text-center md:pt-10"
          >
            <CounterCard {...COUNTRIES_STAT} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
