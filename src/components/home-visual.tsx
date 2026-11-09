'use client';

import { Code2, Compass, Database, Headset, ScanSearch } from 'lucide-react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import type { CSSProperties, PointerEvent } from 'react';

const BASE_ROTATE_X = 50;
const BASE_ROTATE_Z = -30;

// Uses the tmt-* keyframes defined in globals.css (float, ripple, dash).
const z = (value: number, delay: number): CSSProperties =>
  ({ '--tmt-z': `${value}px`, animationDelay: `${delay}s` }) as CSSProperties;

// The five solutions around a TEAM core: one partner from first step to operations.
const TILES = [
  { icon: Code2, label: 'Software', x: '8%', y: '10%' },
  { icon: Database, label: 'Data', x: '62%', y: '4%' },
  { icon: Compass, label: 'AI', x: '72%', y: '52%' },
  { icon: Headset, label: 'Support', x: '36%', y: '70%' },
  { icon: ScanSearch, label: 'AI search', x: '0%', y: '52%' },
];

/** Decorative isometric visual: five solution tiles linked to a central TEAM core. Purely visual. */
export default function HomeVisual() {
  const reduceMotion = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const rotateX = useTransform(sy, [-1, 1], [BASE_ROTATE_X + 6, BASE_ROTATE_X - 6]);
  const rotateZ = useTransform(sx, [-1, 1], [BASE_ROTATE_Z - 8, BASE_ROTATE_Z + 8]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    py.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      aria-hidden='true'
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className='relative mx-auto h-[320px] w-full max-w-[600px] sm:h-[420px] lg:h-[500px]'
    >
      <div className='pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FDBE00]/10 blur-[90px]' />
      <div
        className='absolute left-1/2 top-1/2 h-[420px] w-[460px] origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.62] sm:scale-[0.82] lg:scale-[1]'
        style={{ perspective: '1400px' }}
      >
        <motion.div
          className='relative h-full w-full'
          style={{
            transformStyle: 'preserve-3d',
            rotateX: reduceMotion ? BASE_ROTATE_X : rotateX,
            rotateZ: reduceMotion ? BASE_ROTATE_Z : rotateZ,
          }}
        >
          {/* Platform */}
          <div className='absolute inset-[4%] rounded-[28px] border border-white/5 bg-[#FDBE00]/10' style={{ transform: 'translateZ(-16px)' }} />
          <div
            className='absolute inset-[4%] overflow-hidden rounded-[28px] border border-[#FDBE00]/30 bg-gradient-to-br from-[#1b1710] via-[#0d0c0d] to-[#0d0c18] shadow-[0_0_60px_rgba(253,190,0,0.15)]'
            style={{ transform: 'translateZ(0)' }}
          >
            <div className='absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 animate-[spin_60s_linear_infinite] rounded-full border border-dashed border-[#FDBE00]/25 motion-reduce:animate-none' />
            <svg className='absolute inset-0 h-full w-full' viewBox='0 0 420 380' fill='none'>
              {[
                [80, 70],
                [320, 50],
                [350, 250],
                [210, 320],
                [55, 250],
              ].map(([x, y], i) => (
                <path
                  key={i}
                  d={`M210 190 L${x} ${y}`}
                  stroke='#FDBE00'
                  strokeOpacity='0.45'
                  strokeWidth='2'
                  strokeDasharray='6 10'
                  className='animate-tmt-dash motion-reduce:animate-none'
                />
              ))}
            </svg>
          </div>

          {/* Core */}
          <div className='absolute left-[38%] top-[36%] h-[110px] w-[110px]' style={{ transformStyle: 'preserve-3d' }}>
            <div className='animate-tmt-float h-full w-full motion-reduce:animate-none' style={{ ...z(70, 0), transformStyle: 'preserve-3d' }}>
              <div className='relative flex h-full w-full items-center justify-center rounded-2xl border border-[#FDBE00]/80 bg-black/80 shadow-[0_0_40px_rgba(253,190,0,0.4)]'>
                <span className='absolute inset-0 animate-tmt-ripple rounded-2xl border border-[#FDBE00]/60 motion-reduce:animate-none' />
                <span className='font-sans text-2xl font-bold tracking-wider text-[#FDBE00]'>TEAM</span>
              </div>
            </div>
          </div>

          {TILES.map(({ icon: Icon, label, x, y }, i) => (
            <div key={label} className='absolute h-[96px] w-[110px]' style={{ left: x, top: y, transformStyle: 'preserve-3d' }}>
              <div
                className='animate-tmt-float h-full w-full motion-reduce:animate-none'
                style={{ ...z(30 + (i % 3) * 16, 0.5 + i * 0.5), transformStyle: 'preserve-3d' }}
              >
                <div className='flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-white/15 bg-gradient-to-b from-[#16141a] to-[#0a090b] shadow-[0_0_24px_rgba(94,99,252,0.2)]'>
                  <Icon className='h-7 w-7 text-white/85' />
                  <span className='font-sans text-[10px] uppercase tracking-wider text-white/55'>{label}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
