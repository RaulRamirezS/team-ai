import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";

import {
  aiRecommendationSchema,
  assessmentContextSchema,
} from "@/lib/ai-recommendation-schema";
import { formatAssessmentForPrompt } from "@/lib/assessment-prompt";
import { buildTeamKnowledgePromptBlock } from "@/lib/team-knowledge";

export const runtime = "nodejs";

const MODEL = process.env.OPENAI_RECOMMENDATION_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `
You are TEAM International's recommendation engine for a high-level AI readiness preview.

Rules:
- Output exactly the structured fields requested. No extra keys.
- Use only capabilities from the TEAM knowledge pack. Do not invent TEAM offerings outside it.
- Map the assessment to one or more Services pillars (custom enterprise software, AI implementation, AI agents/workflows, legacy modernization, data & AI platforms).
- Explicitly address every focus the client selected, using their language:
  - "AI improvement opportunity" → name the concrete opportunities you see in their stack and what each one improves.
  - "Close a gap" → name the specific missing capability and how it gets closed.
  - "Fix a special problem" → address that problem directly and how the approach resolves it.
  If a focus is selected, it must be visibly answered in generalContext, opportunities, and solutions. Never leave a selected focus unaddressed.
- opportunities must be 3-4 items, each tied to a system, process, or focus the client actually named. Titles are short labels; details are one sentence. No generic "adopt AI" filler.
- Keep each of the six sections concise (2–4 sentences, or 3-4 short items for opportunities). This is a preview, not a full proposal.
- Focus AI maturity on Level 3 (business applications) and Level 4 (enterprise platforms) only.
- unlockHooks must be 3–5 short bullets that encourage sharing contact details and continuing in chat for deeper personalization.
- Tone: clear, professional, practical. No hype. No purple marketing fluff.
`.trim();

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY is not configured. Add it to .env.local to enable AI recommendations.",
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

  const parsedContext = assessmentContextSchema.safeParse(body);
  if (!parsedContext.success) {
    return NextResponse.json(
      {
        error: "Invalid assessment context.",
        details: parsedContext.error.flatten(),
      },
      { status: 400 },
    );
  }

  const client = new OpenAI({ apiKey });
  const knowledge = buildTeamKnowledgePromptBlock();
  const assessment = formatAssessmentForPrompt(parsedContext.data);

  try {
    const completion = await client.chat.completions.parse({
      model: MODEL,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}\n\n${knowledge}`,
        },
        {
          role: "user",
          content: `Produce a controlled 5-section TEAM recommendation preview for this assessment.\n\n${assessment}`,
        },
      ],
      response_format: zodResponseFormat(
        aiRecommendationSchema,
        "team_ai_recommendation",
      ),
    });

    const message = completion.choices[0]?.message;
    if (message?.refusal) {
      return NextResponse.json(
        { error: "Model refused to generate a recommendation.", refusal: message.refusal },
        { status: 502 },
      );
    }

    const recommendation = message?.parsed
      ? aiRecommendationSchema.parse(message.parsed)
      : null;

    if (!recommendation) {
      return NextResponse.json(
        { error: "Model returned an empty or unparsable recommendation." },
        { status: 502 },
      );
    }

    return NextResponse.json({ recommendation });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown OpenAI error";
    console.error("[api/ai/recommendation]", message);
    return NextResponse.json(
      { error: "Failed to generate recommendation.", detail: message },
      { status: 502 },
    );
  }
}
