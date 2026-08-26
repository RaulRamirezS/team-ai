import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";

import {
  formatAssessmentForPrompt,
  formatRecommendationForPrompt,
} from "@/lib/assessment-prompt";
import {
  engagementBriefRequestSchema,
  engagementBriefSchema,
} from "@/lib/engagement-brief-schema";
import { buildTeamKnowledgePromptBlock } from "@/lib/team-knowledge";

export const runtime = "nodejs";

const MODEL = process.env.OPENAI_BRIEF_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `
You are TEAM International's engagement brief engine. The client completed an AI
readiness assessment, saw a high-level preview, and shared contact details. Produce
a deeper 7-section delivery brief.

Rules:
- Output exactly the structured fields requested. No extra keys.
- Stay consistent with the preview already shown. Deepen it; never contradict it.
- Ground every section in this client's industry, ERP/CRM/custom systems, hosting,
  and stated focuses. Generic advice that would fit any company is a failure.
- Use only capabilities from the TEAM knowledge pack. Never invent TEAM offerings,
  clients, case studies, partnerships, or named references.
- Methodology MUST follow composable architecture: modular systems that integrate
  with existing platforms rather than replacing everything at once. The flow is
  always Legacy System → API Layer → Modern Web Application → AI / Automation.
  Apply that flow to THIS client's systems in the flow captions.
- Keep AI framing on Level 3 (business applications) and Level 4 (enterprise platforms).
- Estimated development time is an indicative range only (e.g. "4–8 months for an
  initial production increment"). Never a fixed deadline, price, or contractual
  commitment. Say it may change after discovery.
- Traditional structured code recommendations should prefer the client's current
  stack when it is viable (.NET, PHP, Java, Node, Python, etc.).
- Team roles must use exact names from the TEAM knowledge pack. Include task and
  tech profile for each. Smallest credible mix.
- Development steps should follow discover → design → expose/integrate → build →
  introduce AI → operate & improve, tailored to this client.
- Tone: clear, professional, practical. No hype. No markdown. No emoji.
`.trim();

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY is not configured. Add it to .env.local to enable engagement briefs.",
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

  const parsed = engagementBriefRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid brief request.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { context, recommendation } = parsed.data;
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
          content:
            "Produce the 7-section TEAM engagement brief for this client after they shared contact details.",
        },
      ],
      response_format: zodResponseFormat(
        engagementBriefSchema,
        "team_engagement_brief",
      ),
    });

    const message = completion.choices[0]?.message;
    if (message?.refusal) {
      return NextResponse.json(
        { error: "Model refused to generate a brief.", refusal: message.refusal },
        { status: 502 },
      );
    }

    const brief = message?.parsed
      ? engagementBriefSchema.parse(message.parsed)
      : null;

    if (!brief) {
      return NextResponse.json(
        { error: "Model returned an empty or unparsable brief." },
        { status: 502 },
      );
    }

    return NextResponse.json({ brief });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown OpenAI error";
    console.error("[api/ai/brief]", detail);
    return NextResponse.json(
      { error: "Failed to generate engagement brief.", detail },
      { status: 502 },
    );
  }
}
