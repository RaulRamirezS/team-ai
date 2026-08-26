import { z } from "zod";

import {
  aiRecommendationSchema,
  assessmentContextSchema,
} from "@/lib/ai-recommendation-schema";

/** One opportunity from the preview, expanded into a controlled deep dive. */
export const opportunityDeepDiveSchema = z.object({
  whyItMatters: z
    .string()
    .describe(
      "Why this matters for this specific client: the cost of leaving it as-is, in business terms.",
    ),
  howItWorks: z
    .string()
    .describe(
      "How TEAM would approach it in practice, referencing their actual systems and the relevant Services pillar.",
    ),
  whatItTakes: z
    .string()
    .describe(
      "What is needed to make it work: data readiness, integrations, access, and the people involved. No prices or fixed timelines.",
    ),
  risks: z
    .string()
    .describe(
      "The main risks or constraints to plan for, including data quality and change management.",
    ),
  firstStep: z
    .string()
    .describe(
      "The single concrete first step that de-risks the rest of the work.",
    ),
});

export const opportunityDeepDiveRequestSchema = z.object({
  context: assessmentContextSchema,
  recommendation: aiRecommendationSchema.optional(),
  opportunity: z.object({
    title: z.string().min(1).max(200),
    detail: z.string().max(1000),
  }),
});

export type OpportunityDeepDive = z.infer<typeof opportunityDeepDiveSchema>;

export const DEEP_DIVE_SECTION_META = [
  { key: "whyItMatters", title: "Why it matters" },
  { key: "howItWorks", title: "How it works" },
  { key: "whatItTakes", title: "What it takes" },
  { key: "risks", title: "Risks to plan for" },
  { key: "firstStep", title: "First step" },
] as const satisfies ReadonlyArray<{
  key: keyof OpportunityDeepDive;
  title: string;
}>;
