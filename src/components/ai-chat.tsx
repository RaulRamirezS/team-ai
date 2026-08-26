"use client";

import {
  ArrowLeft,
  Loader2,
  SendHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type {
  AiRecommendationOpportunity,
  AiRecommendationPreview,
  AiResponseContext,
} from "@/components/ai-response-panel";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type OpportunityDeepDive = {
  whyItMatters: string;
  howItWorks: string;
  whatItTakes: string;
  risks: string;
  firstStep: string;
};

const DEEP_DIVE_SECTIONS = [
  { key: "whyItMatters", title: "Why it matters" },
  { key: "howItWorks", title: "How it works" },
  { key: "whatItTakes", title: "What it takes" },
  { key: "risks", title: "Risks to plan for" },
  { key: "firstStep", title: "First step" },
] as const satisfies ReadonlyArray<{
  key: keyof OpportunityDeepDive;
  title: string;
}>;

function resolveValue(value?: string, other?: string) {
  if (!value) return null;
  if (value === "Other") return other?.trim() || "Other";
  return value;
}

function buildOpeningReply(context: AiResponseContext) {
  const industry = resolveValue(context.industry, context.otherIndustry);
  const erp = resolveValue(context.erpSystem, context.otherErpSystem);
  const crm = resolveValue(context.crmSystem, context.otherCrmSystem);
  const hosting = resolveValue(
    context.hostingStrategy,
    context.otherHostingStrategy,
  );
  const request = context.specialRequestDetails?.trim();

  return [
    "Thanks for sharing your details. I'm ready to keep refining this with you.",
    industry
      ? `For ${industry}, the highest-impact moves usually sit between process bottlenecks and system modernization.`
      : "The highest-impact moves usually sit between process bottlenecks and system modernization.",
    erp || crm || hosting
      ? `Given ${[erp, crm, hosting].filter(Boolean).join(", ")}, we can explore a new AI-powered solution, legacy modernization, or a blend of both.`
      : "We can explore a new AI-powered solution, legacy modernization, or a blend of both.",
    request
      ? `Your note about “${request}” is a strong starting point—ask me anything about next steps, priorities, or trade-offs.`
      : "Ask me about priorities, quick wins, modernization paths, or how TEAM would approach delivery.",
  ].join(" ");
}

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AiChat({
  context,
  recommendation,
  onRestart,
}: {
  context: AiResponseContext;
  recommendation: AiRecommendationPreview;
  onRestart?: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      role: "assistant",
      content: buildOpeningReply(context),
    },
  ]);
  const [input, setInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeOpportunity, setActiveOpportunity] =
    useState<AiRecommendationOpportunity | null>(null);
  const [deepDives, setDeepDives] = useState<
    Record<string, OpportunityDeepDive>
  >({});
  const [isExpanding, setIsExpanding] = useState(false);
  const [deepDiveError, setDeepDiveError] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const deepDiveRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
      deepDiveRef.current?.abort();
    };
  }, []);

  const loadDeepDive = async (opportunity: AiRecommendationOpportunity) => {
    deepDiveRef.current?.abort();
    const controller = new AbortController();
    deepDiveRef.current = controller;

    setDeepDiveError(null);
    setIsExpanding(true);

    try {
      const response = await fetch("/api/ai/opportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, recommendation, opportunity }),
        signal: controller.signal,
      });

      const payload = (await response.json().catch(() => null)) as
        | { deepDive?: OpportunityDeepDive; error?: string }
        | null;
      const deepDive = payload?.deepDive;

      if (!response.ok || !deepDive) {
        throw new Error(
          payload?.error || "Could not expand this opportunity.",
        );
      }

      setDeepDives((current) => ({
        ...current,
        [opportunity.title]: deepDive,
      }));
    } catch (caught) {
      if (controller.signal.aborted) return;
      setDeepDiveError(
        caught instanceof Error
          ? caught.message
          : "Could not expand this opportunity.",
      );
    } finally {
      if (!controller.signal.aborted) {
        setIsExpanding(false);
      }
    }
  };

  const toggleDeepDive = (opportunity: AiRecommendationOpportunity) => {
    if (activeOpportunity?.title === opportunity.title) {
      setActiveOpportunity(null);
      return;
    }

    setActiveOpportunity(opportunity);
    setDeepDiveError(null);

    if (!deepDives[opportunity.title]) {
      void loadDeepDive(opportunity);
    }
  };

  const requestReply = async (history: ChatMessage[]) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    setError(null);
    setIsReplying(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          recommendation,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });

      const payload = (await response.json().catch(() => null)) as
        | { reply?: string; error?: string }
        | null;
      const reply = payload?.reply;

      if (!response.ok || !reply) {
        throw new Error(payload?.error || "Could not reach the AI assistant.");
      }

      setMessages((current) => [
        ...current,
        { id: createId(), role: "assistant", content: reply },
      ]);
    } catch (caught) {
      if (controller.signal.aborted) return;
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not reach the AI assistant.",
      );
    } finally {
      if (!controller.signal.aborted) {
        setIsReplying(false);
      }
    }
  };

  const sendMessage = () => {
    const content = input.trim();
    if (!content || isReplying) {
      return;
    }

    const history: ChatMessage[] = [
      ...messages,
      { id: createId(), role: "user", content },
    ];

    setMessages(history);
    setInput("");
    setActiveOpportunity(null);
    void requestReply(history);
  };

  const retryLastMessage = () => {
    if (isReplying || messages.at(-1)?.role !== "user") {
      return;
    }
    void requestReply(messages);
  };

  return (
    <div className="flex h-[min(34rem,70vh)] min-h-[28rem] w-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#FDBE00]" />
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              Continue with AI
            </p>
            <p className="text-xs text-neutral-500">
              Ask follow-ups about modernization, AI solutions, or next steps
            </p>
          </div>
        </div>
        {onRestart ? (
          <button
            type="button"
            onClick={onRestart}
            className="shrink-0 text-xs font-medium text-neutral-500 underline-offset-2 hover:text-neutral-800 hover:underline"
          >
            Start over
          </button>
        ) : null}
      </div>

      {activeOpportunity ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.08em] text-neutral-500 uppercase">
                Opportunity deep dive
              </p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">
                {activeOpportunity.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                {activeOpportunity.detail}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveOpportunity(null)}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-800"
            >
              <ArrowLeft className="size-3.5" />
              Back to chat
            </button>
          </div>

          {isExpanding ? (
            <div
              className="mt-6 flex items-center gap-2 text-sm text-neutral-500"
              aria-live="polite"
            >
              <Loader2 className="size-4 animate-spin text-[#FDBE00]" />
              Expanding this opportunity for your stack…
            </div>
          ) : deepDiveError ? (
            <div role="alert" className="mt-6 rounded-lg bg-red-50 px-3 py-2.5">
              <p className="text-xs leading-relaxed text-red-700">
                {deepDiveError}
              </p>
              <button
                type="button"
                onClick={() => void loadDeepDive(activeOpportunity)}
                className="mt-1.5 text-xs font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
              >
                Try again
              </button>
            </div>
          ) : deepDives[activeOpportunity.title] ? (
            <dl className="mt-5 space-y-4">
              {DEEP_DIVE_SECTIONS.map((section) => (
                <div key={section.key}>
                  <dt className="text-xs font-semibold tracking-[0.06em] text-neutral-500 uppercase">
                    {section.title}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-neutral-700">
                    {deepDives[activeOpportunity.title][section.key]}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          activeOpportunity && "hidden",
        )}
      >
        <MessageScrollerProvider autoScroll>
          <MessageScroller className="flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-4 px-4 py-4">
                {messages.map((message) => (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.role === "user"}
                  >
                    <Message align={message.role === "user" ? "end" : "start"}>
                      <MessageAvatar
                        className={cn(
                          "size-8",
                          message.role === "assistant"
                            ? "bg-[#FDBE00]/20 text-[#B8860B]"
                            : "bg-neutral-200 text-neutral-700",
                        )}
                      >
                        {message.role === "assistant" ? (
                          <Sparkles className="size-4" />
                        ) : (
                          <UserRound className="size-4" />
                        )}
                      </MessageAvatar>
                      <MessageContent>
                        <div
                          className={cn(
                            "max-w-[min(100%,36rem)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                            message.role === "assistant"
                              ? "bg-neutral-100 text-neutral-800"
                              : "bg-[#FDBE00] text-black",
                          )}
                        >
                          {message.content}
                        </div>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}

                {isReplying ? (
                  <MessageScrollerItem messageId="typing">
                    <Message align="start">
                      <MessageAvatar className="size-8 bg-[#FDBE00]/20 text-[#B8860B]">
                        <Sparkles className="size-4" />
                      </MessageAvatar>
                      <MessageContent>
                        <div className="flex items-center gap-1.5 rounded-2xl bg-neutral-100 px-3.5 py-3">
                          <span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
                          <span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
                          <span className="size-1.5 animate-bounce rounded-full bg-neutral-400" />
                        </div>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ) : null}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>

      {error ? (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 border-t border-red-100 bg-red-50 px-4 py-2.5"
        >
          <p className="text-xs leading-relaxed text-red-700">{error}</p>
          {messages.at(-1)?.role === "user" ? (
            <button
              type="button"
              onClick={retryLastMessage}
              className="shrink-0 text-xs font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
            >
              Try again
            </button>
          ) : null}
        </div>
      ) : null}

      {recommendation.opportunities.length > 0 ? (
        <div className="border-t border-neutral-200 px-3 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="shrink-0 text-xs font-medium text-neutral-500">
              Dig deeper:
            </span>
            {recommendation.opportunities.map((opportunity) => (
              <button
                key={opportunity.title}
                type="button"
                aria-pressed={activeOpportunity?.title === opportunity.title}
                onClick={() => toggleDeepDive(opportunity)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  activeOpportunity?.title === opportunity.title
                    ? "border-[#FDBE00] bg-[#FDBE00]/15 text-neutral-900"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-[#FDBE00] hover:bg-[#FDBE00]/10",
                )}
              >
                {opportunity.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <form
        className="flex items-end gap-2 border-t border-neutral-200 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask about AI opportunities, modernization, or next steps…"
          className="min-h-11 max-h-28 resize-none bg-white"
          disabled={isReplying}
        />
        <Button
          type="submit"
          disabled={!input.trim() || isReplying}
          className="h-11 shrink-0 rounded-full bg-[#FDBE00] px-4 text-black hover:bg-[#FDBE00]/90"
        >
          <SendHorizontal className="size-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
