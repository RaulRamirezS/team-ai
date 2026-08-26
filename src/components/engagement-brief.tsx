"use client";

import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import type {
  DifficultyLevel,
  EngagementBrief,
} from "@/lib/engagement-brief-schema";
import { METHODOLOGY_FLOW } from "@/lib/engagement-brief-schema";
import { cn } from "@/lib/utils";

const DIFFICULTY_STYLES: Record<DifficultyLevel, string> = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Moderate: "border-amber-200 bg-amber-50 text-amber-900",
  High: "border-orange-200 bg-orange-50 text-orange-900",
  "Very high": "border-red-200 bg-red-50 text-red-800",
};

function SectionHeading({
  number,
  title,
}: {
  number: number;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#FDBE00] text-xs font-bold text-black"
      >
        {number}
      </span>
      <h4 className="text-base font-semibold tracking-tight text-neutral-900 sm:text-lg">
        {title}
      </h4>
    </div>
  );
}

function SubLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-[0.06em] text-neutral-500 uppercase">
      {children}
    </p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-2.5 text-sm leading-relaxed text-neutral-600 sm:text-[15px]"
        >
          <span
            aria-hidden
            className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-[#FDBE00]"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function MethodologyFlow({
  flow,
}: {
  flow: EngagementBrief["methodology"]["flow"];
}) {
  return (
    <ol className="mt-4 space-y-0">
      {METHODOLOGY_FLOW.map((layer, index) => (
        <li key={layer.key} className="flex flex-col items-stretch">
          <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
            <p className="text-sm font-semibold text-neutral-900">
              {layer.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600">
              {flow[layer.key]}
            </p>
          </div>
          {index < METHODOLOGY_FLOW.length - 1 ? (
            <div className="flex justify-center py-1.5" aria-hidden>
              <span className="text-lg leading-none text-[#FDBE00]">↓</span>
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function EngagementBriefLoading() {
  return (
    <div
      className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-14"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="relative flex size-16 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-[#FDBE00]/20" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#FDBE00] border-r-[#FDBE00]/40" />
        <Sparkles className="relative size-5 text-[#FDBE00]" />
      </div>
      <p className="mt-5 text-sm font-semibold tracking-[0.12em] text-neutral-800 uppercase">
        Preparing your delivery brief
      </p>
      <p className="mt-2 max-w-sm text-center text-sm text-neutral-500">
        Mapping strategy, methodology, stack, team, and next steps…
      </p>
    </div>
  );
}

export function EngagementBriefPanel({ brief }: { brief: EngagementBrief }) {
  return (
    <div id="delivery-brief" className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-[#FDBE00]">
          <Sparkles className="size-4 text-[#FDBE00]" />
          <p className="text-xs font-semibold tracking-[0.08em] text-neutral-700 uppercase">
            Delivery brief
          </p>
        </div>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
          A tailored path for your systems
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Based on your assessment. Indicative only — discovery with TEAM
          specialists will refine timelines and scope.
        </p>
      </div>

      <section className="space-y-4">
        <SectionHeading number={1} title="Brief" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:col-span-2">
            <SubLabel>Main objective</SubLabel>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
              {brief.brief.mainObjective}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:col-span-2">
            <SubLabel>Strategy</SubLabel>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
              {brief.brief.strategy}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <SubLabel>Degree of difficulty</SubLabel>
            <p
              className={cn(
                "mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                DIFFICULTY_STYLES[brief.brief.degreeOfDifficulty],
              )}
            >
              {brief.brief.degreeOfDifficulty}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {brief.brief.difficultyRationale}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <SubLabel>Estimated development time</SubLabel>
            <p className="mt-2 text-sm font-medium text-neutral-900 sm:text-[15px]">
              {brief.brief.estimatedDevelopmentTime}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Our AI-based methodology" />
        <p className="text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          The trend is toward composable architecture: building modular systems
          that integrate with existing platforms rather than trying to replace
          everything at once.
        </p>
        <p className="text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
          {brief.methodology.framing}
        </p>
        <MethodologyFlow flow={brief.methodology.flow} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="AI / Automation strategy" />
        <div className="space-y-4">
          <div>
            <SubLabel>Strategy</SubLabel>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
              {brief.aiAutomation.strategy}
            </p>
          </div>
          <div>
            <SubLabel>Technology recommendation</SubLabel>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
              {brief.aiAutomation.technologyRecommendation}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <SubLabel>Benefits</SubLabel>
              <div className="mt-2">
                <BulletList items={brief.aiAutomation.benefits} />
              </div>
            </div>
            <div>
              <SubLabel>Risks</SubLabel>
              <div className="mt-2">
                <BulletList items={brief.aiAutomation.risks} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Traditional structured code" />
        <div className="space-y-4">
          <div>
            <SubLabel>Strategy</SubLabel>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
              {brief.traditionalCode.strategy}
            </p>
          </div>
          <div>
            <SubLabel>Benefit</SubLabel>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
              {brief.traditionalCode.benefit}
            </p>
          </div>
          <div>
            <SubLabel>Technology recommendation</SubLabel>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
              {brief.traditionalCode.technologyRecommendation}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading number={5} title="Data and infrastructure brief" />
        <p className="text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
          {brief.dataAndInfrastructure}
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeading number={6} title="Team involved" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {brief.teamInvolved.map((member, index) => (
            <li
              key={`${member.role}-${index}`}
              className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
            >
              <p className="text-sm font-semibold text-neutral-900">
                {member.role}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                {member.task}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                {member.techProfile}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <SectionHeading number={7} title="General development steps" />
        <ol className="space-y-3">
          {brief.developmentSteps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span
                aria-hidden
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-[#FDBE00] text-xs font-semibold text-neutral-800"
              >
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900">
                  {step.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
