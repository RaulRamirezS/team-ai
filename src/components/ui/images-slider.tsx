"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type SliderItem = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
};

export function ImagesSlider({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: readonly SliderItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);
  const loopItems = [...items, ...items];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse",
    );
    container.style.setProperty(
      "--animation-duration",
      speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s",
    );
    setStart(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className="scroller relative z-20 w-full overflow-hidden"
    >
      <ul
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
          className,
        )}
      >
        {loopItems.map((item, index) => (
          <li key={`${item.id}-${index}`} className="flex items-center">
            <Image
              src={item.src}
              width={item.width}
              height={item.height}
              alt={item.alt}
              className="h-6 w-auto max-h-6 object-contain md:h-8 md:max-h-8"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
