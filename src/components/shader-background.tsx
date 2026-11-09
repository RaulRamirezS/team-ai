'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const VERTEX_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/**
 * Domain-warped fbm "liquid aurora" in the brand palette
 * (secondary yellow #FDBE00 + talent indigo #5E63FC) over near-black.
 */
const FRAGMENT_SRC = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + 17.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float t = u_time * 0.06;

  // Two layers of domain warping for a slow, liquid motion
  vec2 q = vec2(fbm(p * 1.4 + vec2(0.0, t)), fbm(p * 1.4 + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(
    fbm(p * 1.6 + 3.0 * q + vec2(1.7, 9.2) + 0.8 * t),
    fbm(p * 1.6 + 3.0 * q + vec2(8.3, 2.8) - 0.6 * t)
  );
  float f = fbm(p * 1.2 + 3.2 * r);

  vec3 black  = vec3(0.0);
  vec3 indigo = vec3(0.369, 0.388, 0.988);
  vec3 gold   = vec3(0.992, 0.745, 0.0);

  // Indigo fills the body of the flow, gold rides on the bright ridges
  float body  = smoothstep(0.25, 0.85, f);
  float ridge = smoothstep(0.62, 0.95, f * (0.6 + 0.8 * length(q)));
  float side  = smoothstep(-0.6, 0.6, p.x + 0.5 * (r.x - 0.5));

  vec3 col = black;
  col = mix(col, indigo * 0.55, body * (0.35 + 0.65 * (1.0 - side)));
  col = mix(col, gold * 0.9, ridge * (0.25 + 0.75 * side));

  // Fine light streaks following the warp field
  float streak = pow(max(0.0, sin((f + r.x) * 18.0 + t * 6.0)), 14.0);
  col += streak * 0.06 * mix(indigo, gold, side);

  // Keep the centre (where text sits) calmer and darker
  float centre = 1.0 - smoothstep(0.0, 0.75, length(p * vec2(0.8, 1.25)));
  col *= mix(1.0, 0.5, centre);

  // Vignette + fade to black at the bottom edge so sections blend
  float vig = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(1.1, 1.0)));
  col *= vig;
  col *= smoothstep(0.0, 0.18, uv.y);

  // Subtle dithering to avoid banding on dark gradients
  col += (hash(gl_FragCoord.xy + u_time) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

type ShaderBackgroundProps = {
  className?: string;
  /** Render scale relative to CSS pixels (lower = cheaper). */
  quality?: number;
  /** Optional page-specific fragment shader (same u_resolution / u_time uniforms). Defaults to the brand aurora. */
  fragmentSource?: string;
};

/**
 * Full-bleed animated WebGL shader background. Place inside a `relative`
 * container. Falls back to soft CSS glows when WebGL is unavailable.
 */
export default function ShaderBackground({ className, quality = 0.6, fragmentSource }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) {
      setFallback(true);
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentSource ?? FRAGMENT_SRC);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      setFallback(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      setFallback(true);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * quality;
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    };

    let raf = 0;
    let visible = true;
    const start = performance.now();
    // Offset so the static (reduced motion) frame looks good
    const timeOffset = 12;

    const draw = (now: number) => {
      gl.uniform1f(timeLoc, reducedMotion ? timeOffset : timeOffset + (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const loop = (now: number) => {
      if (!visible) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw(performance.now());
    if (!reducedMotion) raf = requestAnimationFrame(loop);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    resizeObserver.observe(canvas);

    // Pause rendering while off-screen
    const intersection = new IntersectionObserver(([entry]) => {
      const nowVisible = entry.isIntersecting;
      if (nowVisible && !visible && !reducedMotion) {
        visible = true;
        raf = requestAnimationFrame(loop);
      } else if (!nowVisible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    intersection.observe(canvas);

    return () => {
      visible = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [quality, fragmentSource]);

  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-black', className)} aria-hidden='true'>
      {fallback ? (
        <>
          <div className='absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-[#FDBE00]/20 blur-[150px]' />
          <div className='absolute bottom-1/4 right-1/4 h-[600px] w-[600px] rounded-full bg-[#5E63FC]/20 blur-[180px]' />
        </>
      ) : (
        <canvas ref={canvasRef} className='absolute inset-0 h-full w-full' />
      )}
    </div>
  );
}
