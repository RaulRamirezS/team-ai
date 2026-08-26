"use client";

import { Minus, Plus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "How does TEAM turn complex business challenges into AI software solutions?",
    answer:
      "We design and build AI software that maps to your real operations—not generic tools. The focus is speed and quality at competitive pricing, so you can grow without trading away outcomes.",
  },
  {
    id: "faq-2",
    question: "What kinds of solutions can you deliver?",
    answer:
      "Custom enterprise software, AI in existing systems, AI agents and intelligent workflows, legacy modernization, data and AI platforms, dedicated AI-enabled teams, Salesforce implementation, and information security services.",
  },
  {
    id: "faq-3",
    question: "Can you modernize legacy systems without replacing everything?",
    answer:
      "Yes. Most companies do not want a full rip-and-replace. We analyze the current system, document the architecture, extract APIs, add a modern frontend, connect AI where it helps, and replace old components gradually.",
  },
  {
    id: "faq-4",
    question: "How does the AI readiness assessment work?",
    answer:
      "Start with your industry—that step is required—then add your tech stack, current custom software, and any special request. TEAM’s AI-based methodology turns that context into a path: a new AI solution, modernization, or a blend of both.",
  },
  {
    id: "faq-5",
    question: "Do you also implement Salesforce and information security programs?",
    answer:
      "Yes. As a Salesforce Implementation Partner we customize, integrate, and migrate on native Salesforce. Information Security Studio covers GRC, vCISO, cloud and network security, application security, data protection, and awareness programs.",
  },
  {
    id: "faq-6",
    question: "Why do global enterprises partner with TEAM International?",
    answer:
      "More than 20 years in business, 1,500+ employees, 4.5-year average customer retention, 11 global locations, and delivery across 44 countries—with offshore and nearshore teams for around-the-clock support.",
  },
] as const;

export function FaqSection() {
  return (
    <section className="relative z-20 flex w-full flex-col bg-[#0F0E0F] px-6 py-16 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="text-center text-[1.0625rem] font-bold leading-[1.625rem] text-white lg:text-[2rem] lg:leading-10">
          Frequently asked questions
        </h2>

        <Accordion
          defaultValue={["faq-1"]}
          className="mt-10 w-full"
        >
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-b border-[#3A3338] not-last:border-b"
            >
              <AccordionTrigger className="items-center rounded-none py-5 text-left hover:no-underline [&_[data-slot=accordion-trigger-icon]]:hidden">
                <h3 className="text-base font-bold text-[#F0C41A] lg:text-lg">
                  {index + 1}. {item.question}
                </h3>
                <span className="ml-4 flex size-8 shrink-0 items-center justify-center rounded border border-white text-white group-aria-expanded/accordion-trigger:border-[#F0C41A] group-aria-expanded/accordion-trigger:bg-[#F0C41A] group-aria-expanded/accordion-trigger:text-black">
                  <Plus className="size-4 group-aria-expanded/accordion-trigger:hidden" />
                  <Minus className="hidden size-4 group-aria-expanded/accordion-trigger:block" />
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 pl-4 text-[0.9375rem] leading-6 text-[#9A9197]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
