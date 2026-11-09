'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GlowButtonProps {
  href: string;
  children: React.ReactNode;
  showArrow?: boolean;
  className?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'outline';
}

export function GlowButton({
  href,
  children,
  showArrow = true,
  className,
  fullWidth = false,
  variant = 'default',
}: GlowButtonProps) {
  const LinkComponent = /^(https?:)?\/\//.test(href) ? 'a' : Link;

  if (variant === 'outline') {
    return (
      <LinkComponent
        href={href}
        className={cn(
          'group inline-flex items-center justify-center gap-2 px-6 py-3.5',
          'rounded-md border-2 border-white/80 bg-transparent',
          'text-[0.75rem] font-bold uppercase leading-[1.0625rem] text-white md:text-[0.875rem] md:leading-6',
          'transition-all duration-200 hover:bg-white hover:text-[#0D0C0D]',
          'active:scale-95',
          fullWidth ? 'w-full' : '',
          className
        )}
      >
        {children}
        {showArrow && (
          <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5' />
        )}
      </LinkComponent>
    );
  }

  return (
    <LinkComponent
      href={href}
      className={cn(
        'group relative cursor-pointer rounded-2xl p-[2px] transition-transform duration-200 active:scale-95',
        'bg-[radial-gradient(circle_80px_at_80%_-10%,#ffffff,#181b1b)]',
        fullWidth ? 'block w-full' : 'inline-block',
        className
      )}
    >
      {/* Glow effect */}
      <span
        className='absolute right-0 top-0 -z-10 h-[60%] w-[65%] rounded-[120px] shadow-[0_0_20px_rgba(255,255,255,0.22)]'
        aria-hidden='true'
      />

      {/* Yellow/Gold blob accent */}
      <span
        className='absolute bottom-0 left-0 h-full w-[70px] rounded-2xl bg-[radial-gradient(circle_60px_at_0%_100%,#FDBE00,rgba(253,190,0,0.5),transparent)] shadow-[-10px_10px_30px_rgba(253,190,0,0.18)]'
        aria-hidden='true'
      />

      {/* Inner button */}
      <span
        className={cn(
          'relative z-10 flex items-center justify-center gap-2 rounded-[14px] px-6 py-3.5',
          'bg-[radial-gradient(circle_80px_at_80%_-50%,#756B72,#0D0C0D)]',
          'text-[0.75rem] font-bold uppercase leading-[1.0625rem] text-white md:text-[0.875rem] md:leading-6',
          'before:absolute before:inset-0 before:rounded-[14px]',
          'before:bg-[radial-gradient(circle_60px_at_0%_100%,rgba(253,190,0,0.10),rgba(253,190,0,0.07),transparent)]'
        )}
      >
        {children}
        {showArrow && (
          <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5' />
        )}
      </span>
    </LinkComponent>
  );
}
