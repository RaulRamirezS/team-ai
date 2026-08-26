import OpenAI from "openai";
import { NextResponse } from "next/server";

import { chatRequestSchema } from "@/lib/ai-chat-schema";
import {
  formatAssessmentForPrompt,
  formatRecommendationForPrompt,
} from "@/lib/assessment-prompt";
import { buildTeamKnowledgePromptBlock } from "@/lib/team-knowledge";

export const runtime = "nodejs";

const MODEL = process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `
You are TEAM International's AI assistant. The client just completed a short AI readiness
assessment and received a five-section recommendation preview. You are now answering their
follow-up questions.

Rules:
- Stay consistent with the preview already shown. Refine and expand it; never contradict it.
- Use only capabilities from the TEAM knowledge pack. Never invent TEAM offerings, clients,
  case studies, partnerships, or named references.
- Never quote specific prices, fixed timelines, headcounts, or contractual commitments. Speak
  qualitatively and offer a discovery conversation when the client needs specifics.
- Keep AI framing on Level 3 (business applications) and Level 4 (enterprise platforms).
- Answer in plain conversational text: at most 4 sentences, or up to 4 short lines when a list
  genuinely helps. No markdown headings, no bold, no emoji.
- If a question falls outside software, data, and AI delivery, say so briefly and steer back.
- If you do not know something, say so and suggest a discovery conversation with TEAM
  specialists. Do not guess.
- Encourage a concrete next step when it fits naturally, without being pushy.
`.trim();

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY is not configured. Add it to .env.local to enable AI chat.",
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

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid chat request.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { context, recommendation, messages } = parsed.data;

  const groundingBlocks = [
    buildTeamKnowledgePromptBlock(),
    formatAssessmentForPrompt(context),
    recommendation ? formatRecommendationForPrompt(recommendation) : null,
  ].filter(Boolean);

  const client = new OpenAI({ apiKey });

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}\n\n${groundingBlocks.join("\n\n")}`,
        },
        ...messages,
      ],
    });

    const message = completion.choices[0]?.message;
    if (message?.refusal) {
      return NextResponse.json(
        { error: "Model refused to answer.", refusal: message.refusal },
        { status: 502 },
      );
    }

    const reply = message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "Model returned an empty reply." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown OpenAI error";
    console.error("[api/ai/chat]", detail);
    return NextResponse.json(
      { error: "Failed to generate a reply.", detail },
      { status: 502 },
    );
  }
}
