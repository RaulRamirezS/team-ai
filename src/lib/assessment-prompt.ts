import type {
  AiRecommendation,
  AssessmentContext,
} from "@/lib/ai-recommendation-schema";

function resolveLabel(value?: string, other?: string) {
  if (!value) return null;
  if (value === "Other") return other?.trim() || "Other";
  return value;
}

export function formatAssessmentForPrompt(context: AssessmentContext) {
  const industry = resolveLabel(context.industry, context.otherIndustry);
  const erp = resolveLabel(context.erpSystem, context.otherErpSystem);
  const crm = resolveLabel(context.crmSystem, context.otherCrmSystem);
  const hosting = resolveLabel(
    context.hostingStrategy,
    context.otherHostingStrategy,
  );

  const customSoftware =
    context.customSoftware
      ?.filter((system) => system.name.trim() || system.description.trim())
      .map((system) => {
        const bits = [
          system.name.trim() || "Unnamed system",
          system.description.trim() || null,
          system.hasOwnDatabase
            ? `own database: ${system.hasOwnDatabase}`
            : null,
          system.needsModernization
            ? `needs modernization: ${system.needsModernization}`
            : null,
        ].filter(Boolean);
        return `- ${bits.join(" | ")}`;
      })
      .join("\n") || "None provided";

  const focuses =
    context.specialRequestFocuses
      ?.filter(Boolean)
      .map((focus) => `- ${focus}`)
      .join("\n") || "- None selected";

  return `
Assessment answers:
- Industry: ${industry ?? "Not specified"}
- ERP: ${erp ?? "Not specified"}
- CRM: ${crm ?? "Not specified"}
- Hosting strategy: ${hosting ?? "Not specified"}
- Custom software:
${customSoftware}
- What the client is looking for (selected focuses):
${focuses}
- Special request details: ${context.specialRequestDetails?.trim() || "None"}
`.trim();
}

/** The preview already shown to the client, so chat answers stay consistent with it. */
export function formatRecommendationForPrompt(
  recommendation: AiRecommendation,
) {
  const opportunities = recommendation.opportunities
    .map((item) => `   - ${item.title} — ${item.detail}`)
    .join("\n");

  return `
Recommendation preview already shown to this client:
1. General context: ${recommendation.generalContext}
2. Opportunities:
${opportunities}
3. Solutions: ${recommendation.solutions}
4. Team involved: ${recommendation.teamInvolved}
5. Technology stack: ${recommendation.technologyStack}
6. Main benefit: ${recommendation.mainBenefit}
`.trim();
}
