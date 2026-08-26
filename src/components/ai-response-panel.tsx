"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { AiChat } from "@/components/ai-chat";
import {
  EngagementBriefLoading,
  EngagementBriefPanel,
} from "@/components/engagement-brief";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { EngagementBrief } from "@/lib/engagement-brief-schema";
import { cn } from "@/lib/utils";

const RELATED_LINKS = [
  {
    title: "Insights & thought leadership",
    description: "Explore TEAM articles on AI, digital engineering, and delivery.",
    href: "https://www.teaminternational.com/en/insights",
    type: "Blog",
    image: "/related/blog.webp",
  },
  {
    title: "Success stories",
    description: "See how teams modernized legacy systems and scaled delivery.",
    href: "https://www.teaminternational.com/en/insights/success-stories",
    type: "Case study",
    image: "/related/success-stories.webp",
  },
  {
    title: "Industry intel",
    description: "Practical guidance tailored to your industry challenges.",
    href: "https://www.teaminternational.com/en/insights/industry-intel",
    type: "Insights",
    image: "/related/industry-intel.webp",
  },
  {
    title: "Custom software development",
    description: "Build, modernize, or extend the software your business relies on.",
    href: "https://www.teaminternational.com/en/solutions/custom-software-development",
    type: "Solution",
    image: "/related/custom-software.webp",
  },
  {
    title: "AI Studio",
    description: "Discover how TEAM embeds AI into engineering and operations.",
    href: "https://www.teaminternational.com/en/ai-studio",
    type: "Studio",
    image: "/related/ai-studio.webp",
  },
] as const;

export type AiResponseContext = {
  industry: string;
  otherIndustry?: string;
  erpSystem?: string;
  otherErpSystem?: string;
  crmSystem?: string;
  otherCrmSystem?: string;
  hostingStrategy?: string;
  otherHostingStrategy?: string;
  specialRequestDetails?: string;
  specialRequestFocuses?: string[];
  customSoftware?: Array<{
    name: string;
    description: string;
    hasOwnDatabase?: string;
    needsModernization?: string;
  }>;
};

export type AiRecommendationOpportunity = {
  title: string;
  detail: string;
};

export type AiRecommendationPreview = {
  generalContext: string;
  opportunities: AiRecommendationOpportunity[];
  solutions: string;
  teamInvolved: string;
  technologyStack: string;
  mainBenefit: string;
  unlockHooks: string[];
};

export function AiResponseLoading() {
  return (
    <section
      id="ai-response-panel"
      className="flex w-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-16 shadow-sm sm:min-h-[320px] sm:py-20"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="relative flex size-20 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-[#FDBE00]/20" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#FDBE00] border-r-[#FDBE00]/40" />
        <span className="absolute inset-2 animate-[spin_1.8s_linear_infinite_reverse] rounded-full border-2 border-transparent border-b-neutral-300 border-l-neutral-200" />
        <span className="absolute size-10 animate-pulse rounded-full bg-[#FDBE00]/15 blur-md" />
        <Sparkles className="relative size-6 text-[#FDBE00]" />
      </div>

      <p className="mt-6 text-sm font-semibold tracking-[0.12em] text-neutral-800 uppercase">
        Generating AI recommendation
      </p>
      <p className="mt-2 max-w-sm text-center text-sm text-neutral-500">
        Analyzing your stack, gaps, and opportunities…
      </p>

      <div className="mt-6 flex items-center gap-1.5" aria-hidden>
        <span className="size-1.5 animate-bounce rounded-full bg-[#FDBE00] [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-[#FDBE00] [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-[#FDBE00]" />
      </div>
    </section>
  );
}

const RECOMMENDATION_SECTIONS = [
  { key: "generalContext", title: "General context" },
  { key: "opportunities", title: "Opportunities" },
  { key: "solutions", title: "Solutions" },
  { key: "teamInvolved", title: "Team involved" },
  { key: "technologyStack", title: "Technology stack" },
  { key: "mainBenefit", title: "Main benefit" },
] as const satisfies ReadonlyArray<{
  key: keyof Omit<AiRecommendationPreview, "unlockHooks">;
  title: string;
}>;

function RelatedLinksCard() {
  return (
    <aside className="h-fit w-full rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
      <p className="text-xs font-semibold tracking-[0.08em] text-neutral-500 uppercase">
        Related
      </p>
      <ul className="mt-3 space-y-2">
        {RELATED_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-neutral-200 hover:bg-white"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-200">
                <Image
                  src={link.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-neutral-500">
                  {link.type}
                </p>
                <p className="mt-1 text-sm font-medium text-neutral-900 group-hover:text-neutral-700">
                  {link.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                  {link.description}
                </p>
              </div>
              <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-neutral-400 transition-colors group-hover:text-neutral-700" />
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function ContactDetailsForm({
  onBack,
  onSubmitted,
}: {
  onBack: () => void;
  onSubmitted: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accepted, setAccepted] = useState(false);

  const canSubmit =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    accepted;

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="First Name"
          className="h-11 rounded-md border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500"
        />
        <Input
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          placeholder="Last Name"
          className="h-11 rounded-md border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500"
        />
        <Input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder="Company"
          className="h-11 rounded-md border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500"
        />
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="h-11 rounded-md border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500"
        />
        <Input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Phone"
          className="h-11 rounded-md border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500"
        />
      </div>

      <label className="mt-4 flex items-start gap-3 text-sm text-neutral-700">
        <Checkbox
          checked={accepted}
          onCheckedChange={(checked) => setAccepted(checked === true)}
          className="mt-0.5 border-neutral-400 data-checked:border-[#7CB342] data-checked:bg-[#7CB342] data-checked:text-white"
        />
        <span>
          I confirm that I have read and accepted the{" "}
          <a
            href="https://www.teaminternational.com/en/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7CB342] underline underline-offset-2"
          >
            Privacy Policy and Terms
          </a>
          .
        </span>
      </label>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 items-center rounded-full border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
        >
          Back
        </button>

        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-1.5 w-6 rounded-full bg-[#FDBE00]" />
          <span className="size-1.5 rounded-full bg-neutral-300" />
        </div>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={onSubmitted}
          className={cn(
            "inline-flex h-10 items-center rounded-full bg-[#FDBE00] px-5 text-sm font-medium text-black transition-colors hover:bg-[#FDBE00]/90",
            !canSubmit && "pointer-events-none opacity-50",
          )}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export function AiResponsePanel({
  context,
  recommendation,
  onRestart,
}: {
  context: AiResponseContext;
  recommendation: AiRecommendationPreview;
  onRestart: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [brief, setBrief] = useState<EngagementBrief | null>(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [briefError, setBriefError] = useState<string | null>(null);

  useEffect(() => {
    if (!submitted || !isGeneratingBrief) {
      return;
    }

    const controller = new AbortController();

    const run = async () => {
      setBriefError(null);
      setBrief(null);

      try {
        const response = await fetch("/api/ai/brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context, recommendation }),
          signal: controller.signal,
        });

        const payload = (await response.json()) as {
          brief?: EngagementBrief;
          error?: string;
        };

        if (!response.ok || !payload.brief) {
          throw new Error(
            payload.error || "Could not generate your delivery brief.",
          );
        }

        setBrief(payload.brief);
        setIsGeneratingBrief(false);
        requestAnimationFrame(() => {
          document.getElementById("delivery-brief")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        setBriefError(
          error instanceof Error
            ? error.message
            : "Could not generate your delivery brief.",
        );
        setIsGeneratingBrief(false);
      }
    };

    void run();

    return () => controller.abort();
  }, [submitted, isGeneratingBrief, context, recommendation]);

  const handleContactSubmitted = () => {
    setSubmitted(true);
    setBrief(null);
    setBriefError(null);
    setIsGeneratingBrief(true);
  };

  const handleRetryBrief = () => {
    setBriefError(null);
    setBrief(null);
    setIsGeneratingBrief(true);
  };

  return (
    <section
      id="ai-response-panel"
      className="w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-10">
        <div className="min-w-0 space-y-6">
          <div className="w-full">
            <div className="flex items-center gap-2 text-[#FDBE00]">
              <Sparkles className="size-4 text-[#FDBE00]" />
              <p className="text-xs font-semibold tracking-[0.08em] text-neutral-700 uppercase">
                AI recommendation
              </p>
            </div>

            <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
              A first pass at where AI can help your stack
            </h3>

            <ol className="mt-6 space-y-5">
              {RECOMMENDATION_SECTIONS.map((section, index) => (
                <li key={section.key} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#FDBE00] text-xs font-bold text-black"
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900">
                      {section.title}
                    </p>
                    {section.key === "opportunities" ? (
                      <ul className="mt-2 space-y-2">
                        {recommendation.opportunities.map((opportunity) => (
                          <li
                            key={opportunity.title}
                            className="flex gap-2.5 text-sm leading-relaxed text-neutral-600 sm:text-[15px]"
                          >
                            <span
                              aria-hidden
                              className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-[#FDBE00]"
                            />
                            <span className="min-w-0">
                              <span className="font-medium text-neutral-900">
                                {opportunity.title}
                              </span>
                              {" — "}
                              {opportunity.detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
                        {recommendation[section.key]}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {!showForm && !submitted && (
            <div className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
              <p className="text-sm font-medium text-neutral-900">
                Unlock a deeper, personalized recommendation
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                Share basic contact details to get a delivery brief—strategy,
                methodology, stack, team, and next steps—then continue in chat.
              </p>
              {recommendation.unlockHooks.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {recommendation.unlockHooks.map((hook) => (
                    <li key={hook} className="flex gap-2 text-sm text-neutral-700">
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-[#FDBE00]"
                      />
                      <span>{hook}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <Button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-4 h-10 rounded-full bg-[#FDBE00] px-5 text-black hover:bg-[#FDBE00]/90"
              >
                Continue with AI
              </Button>
            </div>
          )}

          {showForm && !submitted && (
            <ContactDetailsForm
              onBack={() => setShowForm(false)}
              onSubmitted={handleContactSubmitted}
            />
          )}

          {submitted && (
            <div className="space-y-8">
              {isGeneratingBrief ? (
                <EngagementBriefLoading />
              ) : briefError ? (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                  <p className="text-sm font-semibold text-neutral-900">
                    We couldn’t generate your delivery brief
                  </p>
                  <p className="mt-2 text-sm text-neutral-600">{briefError}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleRetryBrief}
                      className="inline-flex h-10 items-center rounded-full bg-[#FDBE00] px-5 text-sm font-medium text-black transition-colors hover:bg-[#FDBE00]/90"
                    >
                      Try again
                    </button>
                    <button
                      type="button"
                      onClick={onRestart}
                      className="inline-flex h-10 items-center rounded-full border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
                    >
                      Restart assessment
                    </button>
                  </div>
                </div>
              ) : brief ? (
                <EngagementBriefPanel brief={brief} />
              ) : null}

              {!isGeneratingBrief && !briefError ? (
                <>
                  <AiChat
                    context={context}
                    recommendation={recommendation}
                    onRestart={onRestart}
                  />

                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
                    <button
                      type="button"
                      className="inline-flex h-auto min-h-10 w-full items-center justify-center rounded-full bg-[#FDBE00] px-5 py-2.5 text-center text-sm font-medium text-black transition-colors hover:bg-[#FDBE00]/90 sm:w-auto"
                    >
                      I&apos;m ready to schedule a free executive consultation
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>

        <RelatedLinksCard />
      </div>
    </section>
  );
}
