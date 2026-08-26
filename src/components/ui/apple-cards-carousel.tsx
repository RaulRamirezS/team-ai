"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
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
};

export function Carousel({ items, initialScroll = 0 }: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      <div
        ref={carouselRef}
        onScroll={checkScrollability}
        className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20"
      >
        <div className="mx-auto flex max-w-7xl flex-row justify-start gap-4 pl-4">
          {items.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: 0.2 * index,
                  ease: "easeOut",
                },
              }}
              key={"card" + index}
              className="self-stretch rounded-3xl last:pr-[5%] md:last:pr-[33%]"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mr-10 flex justify-end gap-2">
        <button
          type="button"
          className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          aria-label="Previous cards"
        >
          <ArrowLeft className="h-6 w-6 text-gray-500" />
        </button>
        <button
          type="button"
          className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
          onClick={scrollRight}
          disabled={!canScrollRight}
          aria-label="Next cards"
        >
          <ArrowRight className="h-6 w-6 text-gray-500" />
        </button>
      </div>
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
    <div className="relative z-10 flex h-full min-h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-[rgba(250,248,249,0.10)] md:min-h-[40rem] md:w-96">
      <div className="relative z-40 flex h-full flex-col p-8">
        <div className="flex min-h-[13rem] shrink-0 flex-col md:min-h-[16rem]">
          <p className="max-w-xs text-left font-sans text-xl font-semibold text-balance text-white md:text-3xl">
            {card.title}
          </p>
          {card.description ? (
            <p className="mt-4 max-w-xs text-left font-sans text-sm leading-relaxed text-white/80 md:text-base">
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
