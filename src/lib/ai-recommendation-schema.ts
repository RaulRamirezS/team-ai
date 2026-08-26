import { z } from "zod";

/** Assessment payload from the stepper (matches AiResponseContext). */
export const assessmentContextSchema = z.object({
  industry: z.string().min(1),
  otherIndustry: z.string().optional(),
  erpSystem: z.string().optional(),
  otherErpSystem: z.string().optional(),
  crmSystem: z.string().optional(),
  otherCrmSystem: z.string().optional(),
  hostingStrategy: z.string().optional(),
  otherHostingStrategy: z.string().optional(),
  specialRequestDetails: z.string().optional(),
  customSoftware: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        hasOwnDatabase: z.string().optional(),
        needsModernization: z.string().optional(),
      }),
    )
    .optional(),
  specialRequestFocuses: z.array(z.string()).optional(),
});

export type AssessmentContext = z.infer<typeof assessmentContextSchema>;

/**
 * Controlled 5-section recommendation + unlock hooks.
 * High-level preview only; contact gate unlocks deeper chat later.
 */
export const aiRecommendationSchema = z.object({
  generalContext: z
    .string()
    .describe(
      "Section 1: Brief framing of the client's industry, stack, and problem/opportunity based on the assessment.",
    ),
  opportunities: z
    .array(
      z.object({
        title: z
          .string()
          .describe("Short opportunity name, roughly 3-8 words."),
        detail: z
          .string()
          .describe(
            "One sentence on what it improves and why it fits their stack.",
          ),
      }),
    )
    .min(1)
    .max(6)
    .describe(
      "Section 2: 3-4 concrete opportunities or gaps drawn from this client's own systems and stated focuses. Each must be specific to their assessment, not generic AI advice.",
    ),
  solutions: z
    .string()
    .describe(
      "Section 3: Recommended TEAM approach mapped to Services pillars (new AI, modernization, hybrid, agents, data platform as relevant).",
    ),
  teamInvolved: z
    .string()
    .describe(
      "Section 4: Which TEAM roles would typically be involved. Use exact role names from the Team.pdf pack (e.g. Solution Architect, AI Engineer, QA Automation Engineer). Keep high-level; pick the smallest credible mix for the recommended path.",
    ),
  technologyStack: z
    .string()
    .describe(
      "Section 5: High-level technology and architecture direction aligned to their ERP/CRM/custom/hosting context—not a vendor sales pitch.",
    ),
  mainBenefit: z
    .string()
    .describe(
      "Section 6: The primary business benefit and why Level 3/4 AI outcomes matter for them.",
    ),
  unlockHooks: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe(
      "3–5 short bullets encouraging the user to share contact details and continue in chat for a deeper, personalized recommendation.",
    ),
});

export type AiRecommendation = z.infer<typeof aiRecommendationSchema>;

export const RECOMMENDATION_SECTION_META = [
  { key: "generalContext", number: 1, title: "General context" },
  { key: "opportunities", number: 2, title: "Opportunities" },
  { key: "solutions", number: 3, title: "Solutions" },
  { key: "teamInvolved", number: 4, title: "Team involved" },
  { key: "technologyStack", number: 5, title: "Technology stack" },
  { key: "mainBenefit", number: 6, title: "Main benefit" },
] as const satisfies ReadonlyArray<{
  key: keyof Omit<AiRecommendation, "unlockHooks">;
  number: number;
  title: string;
}>;
