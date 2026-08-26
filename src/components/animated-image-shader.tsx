"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

/**
 * Turns an image into an animated WebGL shader (no extra dependencies).
 * Tuned for dark hero images with light traces:
 *   - Liquid domain-warp flow
 *   - Luminance-linked light pulse
 *   - Traveling gleam across the brightest strokes
 */

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = (a_pos + 1.0) * 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 v_uv;

uniform sampler2D u_tex;
uniform float u_time, u_intensity, u_glow, u_tone;
uniform vec2  u_res, u_img;

float n(vec2 p){
  return sin(p.x*1.7 + sin(p.y*2.3)) * cos(p.y*1.9 + sin(p.x*1.3));
}

void main(){
  float ca = u_res.x/u_res.y, ia = u_img.x/u_img.y;
  vec2 uv = v_uv;
  if(ca > ia) uv.y = (uv.y-0.5)*(ia/ca)+0.5;
  else        uv.x = (uv.x-0.5)*(ca/ia)+0.5;

  float t = u_time;
  float light = step(0.5, u_tone);

  vec2 q = vec2(
    n(uv*3.0 + vec2(t*0.20, t*0.13)),
    n(uv*3.0 + vec2(t*0.16 + 4.0, -t*0.18 + 2.0))
  );
  vec2 flow = vec2(
    n(uv*5.0 + q*0.8 + vec2(-t*0.10, t*0.12)),
    n(uv*5.0 + q*0.8 + vec2(t*0.14, t*0.09 + 3.0))
  );

  vec2 disp = mix(
    q*0.010 + flow*0.008 + vec2(sin(uv.y*6.0 + t*0.8)*0.004, 0.0),
    q*0.007 + flow*0.012 + vec2(sin(uv.y*10.0 + t*0.45)*0.006, cos(uv.x*8.0 - t*0.35)*0.004),
    light
  ) * u_intensity;

  vec2 suv = uv + disp;
  vec4 tex = texture2D(u_tex, suv);
  vec3 col = tex.rgb;
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  float pulse = 0.5 + 0.5*sin(t*1.4 + suv.x*4.0 + suv.y*2.0);

  if (light > 0.5) {
    float feature = 1.0 - smoothstep(0.78, 0.97, lum);
    float drift = 0.5 + 0.5*sin(t*0.7 + suv.x*9.0 + suv.y*6.0);
    col = mix(col, col * (0.88 + drift * 0.22), feature * 0.55 * u_glow);
    float edge = smoothstep(0.28, 0.0, suv.x) + smoothstep(0.72, 1.0, suv.x);
    col += vec3(0.035, 0.012, 0.028) * edge * (0.45 + 0.55 * sin(t * 0.35)) * u_glow;
  } else {
    float bright = smoothstep(0.12, 0.6, lum);
    col += col * bright * pulse * 0.35 * u_glow;
    float sweep = smoothstep(0.75, 1.0, sin((suv.x - suv.y*0.4)*3.5 - t*1.1));
    col += bright * sweep * vec3(0.15, 0.35, 0.6) * 0.6 * u_glow;
  }

  gl_FragColor = vec4(col, tex.a);
}
`;

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("shader create error");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "shader compile error");
  }
  return shader;
}

type AnimatedImageShaderProps = {
  src: string;
  speed?: number;
  intensity?: number;
  glow?: number;
  tone?: "dark" | "light";
  className?: string;
  style?: CSSProperties;
};

export function AnimatedImageShader({
  src,
  speed = 1,
  intensity = 1,
  glow = 1,
  tone = "dark",
  className,
  style,
}: AnimatedImageShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !src) return;

    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: false,
      alpha: true,
    });
    if (!gl) {
      console.error("WebGL is not available in this browser.");
      return;
    }

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uInt = gl.getUniformLocation(program, "u_intensity");
    const uGlow = gl.getUniformLocation(program, "u_glow");
    const uTone = gl.getUniformLocation(program, "u_tone");
    const uRes = gl.getUniformLocation(program, "u_res");
    const uImg = gl.getUniformLocation(program, "u_img");

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0]),
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let imgW = 1;
    let imgH = 1;
    let loaded = false;
    let cancelled = false;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      imgW = img.naturalWidth;
      imgH = img.naturalHeight;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      loaded = true;
      canvas.style.opacity = "1";
    };
    img.onerror = () => console.error("Could not load shader image:", src);
    img.src = src;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 640;
      const h = canvas.clientHeight || 360;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const start = performance.now();
    const render = (now: number) => {
      const t = ((now - start) / 1000) * speed;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uInt, intensity);
      gl.uniform1f(uGlow, glow);
      gl.uniform1f(uTone, tone === "light" ? 1 : 0);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uImg, loaded ? imgW : 1, loaded ? imgH : 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.deleteTexture(texture);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, [src, speed, intensity, glow, tone]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        opacity: 0,
        ...style,
      }}
    />
  );
}
