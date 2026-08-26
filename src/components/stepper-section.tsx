"use client";

import { useEffect, useState } from "react";

import {
  AiResponseLoading,
  AiResponsePanel,
  type AiRecommendationPreview,
  type AiResponseContext,
} from "@/components/ai-response-panel";
import { VerticalStepperBlock } from "@/components/stepperize/vertical-stepper";

export function StepperSection() {
  const [aiContext, setAiContext] = useState<AiResponseContext | null>(null);
  const [recommendation, setRecommendation] =
    useState<AiRecommendationPreview | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [stepperKey, setStepperKey] = useState(0);

  useEffect(() => {
    if (!isGenerating || !aiContext) {
      return;
    }

    const controller = new AbortController();

    const run = async () => {
      setGenerationError(null);
      setRecommendation(null);

      try {
        const response = await fetch("/api/ai/recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(aiContext),
          signal: controller.signal,
        });

        const payload = (await response.json()) as {
          recommendation?: AiRecommendationPreview;
          error?: string;
        };

        if (!response.ok || !payload.recommendation) {
          throw new Error(
            payload.error || "Could not generate an AI recommendation.",
          );
        }

        setRecommendation(payload.recommendation);
        setIsGenerating(false);
      } catch (error) {
        if (controller.signal.aborted) return;
        setGenerationError(
          error instanceof Error
            ? error.message
            : "Could not generate an AI recommendation.",
        );
        setIsGenerating(false);
      }
    };

    void run();

    return () => controller.abort();
  }, [aiContext, isGenerating]);

  const handleAiResponseReady = (context: AiResponseContext) => {
    setAiContext(context);
    setRecommendation(null);
    setGenerationError(null);
    setIsGenerating(true);
  };

  const handleRestart = () => {
    setAiContext(null);
    setRecommendation(null);
    setGenerationError(null);
    setIsGenerating(false);
    setStepperKey((key) => key + 1);
  };

  const handleRetry = () => {
    if (!aiContext) return;
    setGenerationError(null);
    setRecommendation(null);
    setIsGenerating(true);
  };

  return (
    <section className="bg-white text-neutral-900">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold tracking-[0.14em] text-neutral-500 uppercase">
              AI readiness assessment
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Every industry has problems to solve and opportunities to improve
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              Tell us your industry and what you need—whether you are fixing a
              specific challenge or unlocking an improvement opportunity. That
              path may be an AI-powered solution built from scratch,
              modernization of current custom software, or a combination of
              both. TEAM International’s AI-based methodology and experienced
              engineering team turn that context into a fast, effective path
              forward.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-neutral-600">
              <li className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-[#FDBE00]"
                />
                <span>
                  Map your industry needs, ERP and CRM landscape, and the systems
                  your teams rely on today.
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-[#FDBE00]"
                />
                <span>
                  Explore a new AI solution, legacy system modernization, or a
                  blended approach that closes gaps and surfaces improvement
                  opportunities without disrupting operations.
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-[#FDBE00]"
                />
                <span>
                  Get a tailored recommendation powered by TEAM’s AI-enhanced
                  delivery experience—built for speed, quality, and real business
                  impact.
                </span>
              </li>
            </ul>
            <p className="mt-6 text-sm font-medium text-neutral-800">
              Start with your industry on the right—only that step is required.
            </p>
          </div>

          <div className="min-w-0">
            <VerticalStepperBlock
              key={stepperKey}
              onAiResponseReady={handleAiResponseReady}
            />
          </div>
        </div>

        {aiContext || isGenerating ? (
          <div className="mt-10 w-full">
            {isGenerating ? (
              <AiResponseLoading />
            ) : generationError ? (
              <section
                id="ai-response-panel"
                className="w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <p className="text-sm font-semibold text-neutral-900">
                  We couldn’t generate your recommendation
                </p>
                <p className="mt-2 text-sm text-neutral-600">{generationError}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex h-10 items-center rounded-full bg-[#FDBE00] px-5 text-sm font-medium text-black transition-colors hover:bg-[#FDBE00]/90"
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="inline-flex h-10 items-center rounded-full border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
                  >
                    Restart assessment
                  </button>
                </div>
              </section>
            ) : aiContext && recommendation ? (
              <AiResponsePanel
                context={aiContext}
                recommendation={recommendation}
                onRestart={handleRestart}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
