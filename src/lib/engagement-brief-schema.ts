import { z } from "zod";

import {
  aiRecommendationSchema,
  assessmentContextSchema,
} from "@/lib/ai-recommendation-schema";

export const difficultyLevels = [
  "Low",
  "Moderate",
  "High",
  "Very high",
] as const;

export const engagementBriefSchema = z.object({
  brief: z.object({
    mainObjective: z
      .string()
      .describe(
        "The primary objective for this client in 2–3 sentences, tied to their industry, systems, and stated focuses.",
      ),
    strategy: z
      .string()
      .describe(
        "The recommended delivery strategy: new AI, modernization, hybrid, and why it fits this stack.",
      ),
    degreeOfDifficulty: z
      .enum(difficultyLevels)
      .describe(
        "Overall delivery difficulty given their current systems, data, and integrations.",
      ),
    difficultyRationale: z
      .string()
      .describe(
        "One or two sentences explaining the difficulty rating. Name the real constraints (legacy, data quality, integrations).",
      ),
    estimatedDevelopmentTime: z
      .string()
      .describe(
        "An indicative range only, e.g. '4–8 months for an initial production increment'. Never a fixed deadline. Note that discovery may change it.",
      ),
  }),
  methodology: z.object({
    framing: z
      .string()
      .describe(
        "How TEAM's composable-architecture methodology applies here: modular systems that integrate with existing platforms instead of replacing everything at once. 2–4 sentences, specific to this client.",
      ),
    flow: z.object({
      legacySystem: z
        .string()
        .describe(
          "Short caption for the Legacy System layer: which of their current systems stay in place first.",
        ),
      apiLayer: z
        .string()
        .describe(
          "Short caption for the API Layer: how those systems get exposed without a big-bang rewrite.",
        ),
      modernWebApplication: z
        .string()
        .describe(
          "Short caption for the Modern Web Application layer: what new UX/workflows sit on top.",
        ),
      aiAutomation: z
        .string()
        .describe(
          "Short caption for the AI / Automation layer: where Level 3/4 AI attaches with human oversight.",
        ),
    }),
  }),
  aiAutomation: z.object({
    strategy: z
      .string()
      .describe(
        "AI/automation strategy for this client. Level 3–4 only. Ground in their processes and systems.",
      ),
    technologyRecommendation: z
      .string()
      .describe(
        "Recommended AI/data technologies and how they connect to their ERP/CRM/custom/hosting stack. No invented vendors or partnerships.",
      ),
    benefits: z
      .array(z.string())
      .min(2)
      .max(4)
      .describe("Concrete benefits for this client, not generic AI claims."),
    risks: z
      .array(z.string())
      .min(2)
      .max(4)
      .describe(
        "Real risks: data quality, change management, integration, governance. Be candid.",
      ),
  }),
  traditionalCode: z.object({
    strategy: z
      .string()
      .describe(
        "How structured application code (APIs, business logic, UI) is built and maintained beside AI. Specific to this engagement.",
      ),
    benefit: z
      .string()
      .describe(
        "Why traditional structured code still matters here: reliability, ownership of workflows, auditability, or integration control.",
      ),
    technologyRecommendation: z
      .string()
      .describe(
        "Recommended application stack (.NET, PHP, Java, Node, Python, etc.) justified by their current systems and hosting. Prefer what they already run unless there is a clear reason to change.",
      ),
  }),
  dataAndInfrastructure: z
    .string()
    .describe(
      "Data and infrastructure brief: hosting, integrations, data readiness, pipelines, and what must be true before AI is trustworthy. 3–6 sentences.",
    ),
  teamInvolved: z
    .array(
      z.object({
        role: z
          .string()
          .describe(
            "Exact TEAM role name from the knowledge pack (e.g. Solution Architect, AI Engineer).",
          ),
        task: z
          .string()
          .describe("The main work this role does on this engagement."),
        techProfile: z
          .string()
          .describe(
            "Short tech profile: skills and tools this role needs for this client's stack.",
          ),
      }),
    )
    .min(4)
    .max(8)
    .describe(
      "Specialized TEAM roles required. Smallest credible mix. Use exact role names from the pack.",
    ),
  developmentSteps: z
    .array(
      z.object({
        title: z.string().describe("Short step name, 2–6 words."),
        detail: z
          .string()
          .describe(
            "What happens in this step for this client. One or two sentences.",
          ),
      }),
    )
    .min(5)
    .max(7)
    .describe(
      "General development steps in delivery order: discover → design → expose/integrate → build → AI → operate. Tailor to this client.",
    ),
});

export const engagementBriefRequestSchema = z.object({
  context: assessmentContextSchema,
  recommendation: aiRecommendationSchema.optional(),
});

export type EngagementBrief = z.infer<typeof engagementBriefSchema>;
export type DifficultyLevel = (typeof difficultyLevels)[number];

export const METHODOLOGY_FLOW = [
  { key: "legacySystem", title: "Legacy System" },
  { key: "apiLayer", title: "API Layer" },
  { key: "modernWebApplication", title: "Modern Web Application" },
  { key: "aiAutomation", title: "AI / Automation" },
] as const satisfies ReadonlyArray<{
  key: keyof EngagementBrief["methodology"]["flow"];
  title: string;
}>;
