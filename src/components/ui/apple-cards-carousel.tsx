"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface CardGridProps {
  items: React.ReactElement[];
}

export type Card = {
  src?: string;
  title: string;
  category: string;
  description?: string;
  solutionsTitle?: string;
  solutions?: string[];
  studioIcon?: string;
  studioLabel?: string;
  /** Primary call to action, e.g. opens the offering-specific solution finder. */
  cta?: {
    label: string;
    href: string;
  };
};

export function CardGrid({ items }: CardGridProps) {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 py-10 md:grid-cols-2 md:py-16 lg:grid-cols-3 lg:gap-8">
      {items.map((item, index) => (
        <motion.div
          key={"card" + index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.5,
            delay: 0.1 * (index % 3),
            ease: "easeOut",
          }}
          className="h-full rounded-3xl"
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
}

function CorporateCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      aria-hidden
      className="mt-0.5 h-3.5 w-[1.125rem] shrink-0"
    >
      <path
        d="M6.00016 11.17L1.83016 7.00003L0.410156 8.41003L6.00016 14L18.00016 2.00003L16.59016 0.590027L6.00016 11.17Z"
        fill="#FDBE00"
      />
    </svg>
  );
}

export function Card({ card }: { card: Card }) {
  return (
    <div className="relative z-10 flex h-full min-h-80 w-full flex-col items-start justify-start overflow-hidden rounded-3xl bg-[rgba(250,248,249,0.10)] md:min-h-[40rem]">
      <div className="relative z-40 flex h-full flex-col p-8">
        <div className="flex min-h-[13rem] shrink-0 flex-col md:min-h-[16rem]">
          <p className="text-left font-sans text-xl font-semibold text-balance text-white md:text-3xl">
            {card.title}
          </p>
          {card.description ? (
            <p className="mt-4 text-left font-sans text-sm leading-relaxed text-white/80 md:text-base">
              {card.description}
            </p>
          ) : null}
        </div>
        {card.solutions?.length ? (
          <div className="mt-4">
            {card.solutionsTitle ? (
              <p className="mb-2 text-left font-sans text-sm font-semibold text-white md:text-base">
                {card.solutionsTitle}
              </p>
            ) : null}
            <ul className="flex flex-col gap-1.5">
              {card.solutions.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-left font-sans text-sm leading-snug text-white/80 md:text-[0.9375rem]"
                >
                  <CorporateCheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-auto flex flex-col items-start gap-4 pt-6">
          {card.cta ? (
            <a
              href={card.cta.href}
              className="group inline-flex items-center gap-2 rounded-full border border-[#FDBE00]/30 bg-[#FDBE00]/10 px-3.5 py-2 text-left text-[0.75rem] font-medium leading-tight text-[#FDBE00] transition-colors hover:border-[#FDBE00]/60 hover:bg-[#FDBE00]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDBE00] md:text-[0.8125rem]"
            >
              <Sparkles className="size-3.5 shrink-0 opacity-80" aria-hidden />
              {card.cta.label}
              <ArrowRight className="size-3.5 shrink-0 opacity-80 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </a>
          ) : null}
          <button
            type="button"
            className="group flex items-center justify-start text-[0.75rem] font-bold uppercase leading-[1.0625rem] text-[#1EC69C] hover:text-[#40D1A7] hover:underline active:text-[#0E8D70] md:text-[0.875rem] md:leading-6"
          >
            READ MORE
            <ChevronRight className="size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1.5" />
          </button>
          {card.studioLabel ? (
            <div className="flex items-center gap-2">
              {card.studioIcon ? (
                <Image
                  src={card.studioIcon}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 object-contain"
                />
              ) : null}
              <span className="text-left font-sans text-sm font-medium text-white md:text-base">
                {card.studioLabel}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
