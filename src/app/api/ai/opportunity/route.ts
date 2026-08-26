import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";

import {
  formatAssessmentForPrompt,
  formatRecommendationForPrompt,
} from "@/lib/assessment-prompt";
import {
  opportunityDeepDiveRequestSchema,
  opportunityDeepDiveSchema,
} from "@/lib/opportunity-deep-dive-schema";
import { buildTeamKnowledgePromptBlock } from "@/lib/team-knowledge";

export const runtime = "nodejs";

const MODEL = process.env.OPENAI_DEEP_DIVE_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `
You expand one opportunity from TEAM International's recommendation preview into a deeper,
still high-level explanation for the client who just completed the assessment.

Rules:
- Output exactly the structured fields requested. No extra keys.
- Stay consistent with the preview already shown. Deepen it; never contradict it.
- Ground every field in this client's own industry, systems, hosting, and stated focuses.
  Generic AI advice that would apply to any company is a failure.
- Use only capabilities from the TEAM knowledge pack. Never invent TEAM offerings, clients,
  case studies, or partnerships.
- Never quote prices, fixed timelines, headcounts, or contractual commitments.
- Keep AI framing on Level 3 (business applications) and Level 4 (enterprise platforms).
- Each field is 1-3 sentences of plain prose. No markdown, no bullet characters, no headings.
- Be candid about risks and data-quality constraints rather than optimistic.
`.trim();

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY is not configured. Add it to .env.local to enable deep dives.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = opportunityDeepDiveRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid deep dive request.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { context, recommendation, opportunity } = parsed.data;

  const groundingBlocks = [
    buildTeamKnowledgePromptBlock(),
    formatAssessmentForPrompt(context),
    recommendation ? formatRecommendationForPrompt(recommendation) : null,
  ].filter(Boolean);

  const client = new OpenAI({ apiKey });

  try {
    const completion = await client.chat.completions.parse({
      model: MODEL,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}\n\n${groundingBlocks.join("\n\n")}`,
        },
        {
          role: "user",
          content: `Expand this opportunity for the client.\n\nOpportunity: ${opportunity.title}\nSummary shown to them: ${opportunity.detail}`,
        },
      ],
      response_format: zodResponseFormat(
        opportunityDeepDiveSchema,
        "opportunity_deep_dive",
      ),
    });

    const message = completion.choices[0]?.message;
    if (message?.refusal) {
      return NextResponse.json(
        { error: "Model refused to expand this opportunity.", refusal: message.refusal },
        { status: 502 },
      );
    }

    const deepDive = message?.parsed
      ? opportunityDeepDiveSchema.parse(message.parsed)
      : null;

    if (!deepDive) {
      return NextResponse.json(
        { error: "Model returned an empty or unparsable deep dive." },
        { status: 502 },
      );
    }

    return NextResponse.json({ deepDive });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown OpenAI error";
    console.error("[api/ai/opportunity]", detail);
    return NextResponse.json(
      { error: "Failed to expand this opportunity.", detail },
      { status: 502 },
    );
  }
}
