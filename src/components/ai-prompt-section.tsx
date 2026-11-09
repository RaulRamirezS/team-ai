"use client";

import { ArrowRight, ArrowUp, Check, Loader2, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import {
  generateSolutionStrategy,
  type SolutionStrategy,
} from "@/lib/mock-solution-strategy";
import { cn } from "@/lib/utils";

/** Event the assessment stepper listens to in order to prefill its request. */
export const PROMPT_SUBMIT_EVENT = "team:prompt-submit";

const MAX_LENGTH = 1000;

const SUGGESTIONS = [
  "Modernize our legacy ERP without replacing it",
  "Add AI agents to our customer support workflow",
  "Build a customer portal on top of our CRM",
  "Unify our data for AI-ready analytics",
] as const;

type Status = "idle" | "loading" | "done" | "error";

export function AiPromptSection() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [strategy, setStrategy] = useState<SolutionStrategy | null>(null);
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const textareaId = useId();
  const canSubmit = value.trim().length > 0 && status !== "loading";

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (status === "loading" || status === "done") {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [status]);

  const submit = async () => {
    const prompt = value.trim();
    if (!prompt || status === "loading") return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSubmittedPrompt(prompt);
    setStrategy(null);
    setStatus("loading");

    try {
      const result = await generateSolutionStrategy(prompt, controller.signal);
      setStrategy(result);
      setStatus("done");
    } catch {
      if (controller.signal.aborted) return;
      setStatus("error");
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setStatus("idle");
    setStrategy(null);
    setValue("");
  };

  const refineWithAssessment = () => {
    window.dispatchEvent(
      new CustomEvent<string>(PROMPT_SUBMIT_EVENT, { detail: submittedPrompt }),
    );
    document
      .getElementById("find-solutions")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      aria-labelledby={`${textareaId}-heading`}
      className="relative isolate overflow-hidden bg-[#0F0E0F] px-6 py-16 text-white lg:px-10 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[48rem] max-w-full -translate-x-1/2 rounded-full bg-[#FDBE00]/10 blur-3xl"
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <motion.h2
          id={`${textareaId}-heading`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center text-[1.5rem] font-bold leading-snug text-balance text-[#FAF8F9] lg:text-[2.25rem] lg:leading-[2.75rem]"
        >
          Describe Your Project Need to Get an Instant Technical Solution
          Strategy
        </motion.h2>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          className="mt-8 w-full rounded-3xl border border-white/15 bg-white/[0.06] p-3 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-colors focus-within:border-[#FDBE00]/60 lg:mt-10"
        >
          <label htmlFor={textareaId} className="sr-only">
            Describe your project need
          </label>
          <Textarea
            id={textareaId}
            value={value}
            maxLength={MAX_LENGTH}
            rows={3}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submit();
              }
            }}
            placeholder="Tell us about your business challenge, the systems involved, and what you want to achieve…"
            className="min-h-24 max-h-56 resize-none border-0 bg-transparent px-3 py-2 text-base text-white shadow-none placeholder:text-white/45 focus-visible:ring-0 dark:bg-transparent md:text-base"
          />
          <div className="flex items-center justify-between gap-3 px-2 pt-2">
            <p className="flex items-center gap-1.5 text-xs text-white/50">
              <Sparkles className="size-3.5 text-[#FDBE00]" aria-hidden />
              <span className="hidden sm:inline">
                Press Enter to send · Shift + Enter for a new line
              </span>
              <span className="sm:hidden">AI-powered strategy</span>
            </p>
            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full bg-[#FDBE00] px-5 text-sm font-semibold text-black transition-colors",
                "hover:bg-[#FDBE00]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDBE00]",
                "disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40",
              )}
            >
              {status === "loading" ? (
                <>
                  Analyzing
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                </>
              ) : (
                <>
                  Get my strategy
                  <ArrowUp className="size-4" aria-hidden />
                </>
              )}
            </button>
          </div>
        </motion.form>

        {status === "idle" ? (
          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            aria-label="Example project needs"
            className="mt-5 flex flex-wrap justify-center gap-2"
          >
            {SUGGESTIONS.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => setValue(suggestion)}
                  className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/70 transition-colors hover:border-[#FDBE00]/50 hover:bg-[#FDBE00]/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDBE00] sm:text-[0.8125rem]"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}

        <div ref={resultRef} className="mt-8 w-full scroll-mb-8" aria-live="polite">
          <AnimatePresence mode="wait">
            {status === "loading" ? (
              <StrategyLoading key="loading" />
            ) : status === "error" ? (
              <motion.div
                key="error"
                role="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100"
              >
                We couldn’t generate a strategy right now.{" "}
                <button
                  type="button"
                  onClick={() => void submit()}
                  className="font-semibold underline underline-offset-2"
                >
                  Try again
                </button>
              </motion.div>
            ) : status === "done" && strategy ? (
              <StrategyResult
                key="result"
                strategy={strategy}
                prompt={submittedPrompt}
                onRefine={refineWithAssessment}
                onReset={reset}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function StrategyLoading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      aria-busy="true"
      className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-10 text-center"
    >
      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="size-2 animate-bounce rounded-full bg-[#FDBE00] [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-[#FDBE00] [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-[#FDBE00]" />
      </div>
      <p className="text-sm font-semibold tracking-[0.12em] text-white uppercase">
        Building your solution strategy
      </p>
      <p className="text-sm text-white/60">
        Matching your need to TEAM’s studios and engagement models…
      </p>
    </motion.div>
  );
}

function StrategyResult({
  strategy,
  prompt,
  onRefine,
  onReset,
}: {
  strategy: SolutionStrategy;
  prompt: string;
  onRefine: () => void;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] text-left"
    >
      <div className="border-b border-white/10 p-6 sm:p-8">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-[#FDBE00] uppercase">
          <Sparkles className="size-4" aria-hidden />
          Your preliminary solution strategy
        </p>
        <p className="mt-3 border-l-2 border-white/20 pl-3 text-sm text-white/55 italic">
          “{prompt}”
        </p>
        <p className="mt-4 text-base leading-relaxed text-white/90">
          {strategy.summary}
        </p>
        {strategy.detectedTopics.length > 0 ? (
          <ul
            aria-label="Topics detected in your description"
            className="mt-4 flex flex-wrap gap-2"
          >
            {strategy.detectedTopics.map((topic) => (
              <li
                key={topic}
                className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70"
              >
                {topic}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="grid gap-px bg-white/10 md:grid-cols-2">
        <ResultBlock title="Recommended studios">
          <ul className="space-y-4">
            {strategy.studios.map((studio) => (
              <li key={studio.id}>
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
                  {studio.name}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold tracking-wide uppercase",
                      studio.role === "lead"
                        ? "bg-[#FDBE00] text-black"
                        : "bg-white/10 text-white/70",
                    )}
                  >
                    {studio.role === "lead" ? "Lead" : "Supporting"}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/65">
                  {studio.reason}
                </p>
              </li>
            ))}
          </ul>
        </ResultBlock>

        <ResultBlock title="What you can expect">
          <ul className="space-y-2.5">
            {strategy.deliverables.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-white/80"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[#FDBE00]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </ResultBlock>

        <ResultBlock title="Suggested approach" className="md:col-span-2">
          <ol className="grid gap-4 sm:grid-cols-2">
            {strategy.approach.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FDBE00]/15 text-xs font-bold text-[#FDBE00]">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </ResultBlock>

        <ResultBlock title="Recommended engagement model" className="md:col-span-2">
          <p className="text-sm font-semibold text-white">
            {strategy.engagementModel.name}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-white/65">
            {strategy.engagementModel.description}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            {strategy.engagementModel.reason}
          </p>
        </ResultBlock>
      </div>

      <div className="flex flex-col gap-4 border-t border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="max-w-md text-sm leading-relaxed text-white/60">
          {strategy.nextStep}
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="rounded-full px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Start over
          </button>
          <button
            type="button"
            onClick={onRefine}
            className="group inline-flex items-center gap-2 rounded-full bg-[#FDBE00] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#FDBE00]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDBE00]"
          >
            Refine with the assessment
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ResultBlock({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("bg-[#161516] p-6 sm:p-8", className)}>
      <h3 className="mb-4 text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}
