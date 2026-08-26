import { z } from "zod";

import {
  aiRecommendationSchema,
  assessmentContextSchema,
} from "@/lib/ai-recommendation-schema";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

/** Follow-up chat turn, carrying the assessment and the preview already shown. */
export const chatRequestSchema = z.object({
  context: assessmentContextSchema,
  recommendation: aiRecommendationSchema.optional(),
  messages: z.array(chatMessageSchema).min(1).max(40),
});

export type ChatMessagePayload = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
