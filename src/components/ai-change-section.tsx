"use client";

import Image from "next/image";

import {
  Card,
  Carousel,
  type Card as CardType,
} from "@/components/ui/apple-cards-carousel";
import { getAssetUrl } from "@/lib/assets";

const data: CardType[] = [
  {
    category: "Artificial Intelligence",
    title: "Custom enterprise software development",
    description:
      "Our composable architecture: building modular systems that integrate with existing platforms rather than trying to replace everything at once.",
    studioIcon: getAssetUrl("ai-studio-new/ai-studio-layer-6.webp"),
    studioLabel: "AI/Transformation Studio",
    solutionsTitle: "Typical solutions:",
    solutions: [
      "Internal business platforms",
      "Customer portals",
      "Employee portals",
      "Operations management systems",
      "Financial applications",
      "Supply chain platforms",
    ],
  },
  {
    category: "Productivity",
    title: "AI implementation for existing companies",
    description:
      "We identify where AI can create measurable value in your business and implement it securely into your existing systems.",
    studioIcon: getAssetUrl("ai-studio-new/ai-studio-layer-6.webp"),
    studioLabel: "AI/Transformation Studio",
    solutionsTitle: "Typical solutions:",
    solutions: [
      "Demand forecasting",
      "Inventory optimization",
      "Financial anomaly detection",
      "Cash flow forecasting",
      "Predictive maintenance",
    ],
  },
  {
    category: "Product",
    title: "AI agents and intelligent workflows",
    description:
      "Enterprise adoption is increasingly moving toward AI agents, but these systems require governance, security, monitoring, and human oversight.",
    studioIcon: getAssetUrl("ai-studio-new/ai-studio-layer-6.webp"),
    studioLabel: "AI/Transformation Studio",
    solutionsTitle: "Typical solutions:",
    solutions: [
      "Detect the overdue invoice",
      "Review the customer's payment history",
      "Analyze their risk",
      "Draft an email",
      "Recommend whether to pause credit",
      "Ask for human approval",
      "Update the CRM",
    ],
  },
  {
    category: "Product",
    title: "Legacy system modernization",
    description:
      "Companies doesn't necessarily want to replace everything. We have the engineering expertise required to understand the business and safely transform the system.",
    studioIcon: getAssetUrl("ai-studio-new/ai-studio-layer-6.webp"),
    studioLabel: "AI/Transformation Studio",
    solutionsTitle: "Our approach:",
    solutions: [
      "Analyze the legacy system",
      "Document the existing architecture",
      "Extract APIs",
      "Build a modern frontend",
      "Connect AI capabilities",
      "Gradually replace old components",
    ],
  },
  {
    category: "iOS",
    title: "Data and AI platforms",
    description: "Your business may not need a simple application. You need a data platform.",
    studioIcon: getAssetUrl("new-data-studio/data-studio-turning.webp"),
    studioLabel: "Data Studio",
    solutionsTitle: "Typical solutions:",
    solutions: [
      "Data integration",
      "Data warehouses",
      "Business intelligence",
      "Predictive analytics",
      "AI-ready data architecture",
      "Company knowledge bases",
      "Secure AI access to enterprise data",
    ],
  },
  {
    category: "Hiring",
    title: "Dedicated AI-enabled teams",
    description:
      "We provide a specialized product engineering team that can deliver more with AI-augmented development.",
    solutionsTitle: "Our team include:",
    solutions: [
      "Product/Business Analyst",
      "Solution Architect",
      "Senior Full-Stack Developer",
      "AI Engineer",
      "QA Automation Engineer",
      "DevOps/Cloud Engineer",
    ],
  },
  {
    category: "CRM",
    title: "Salesforce Implementation Partner",
    description:
      "Certified architects start from your actual processes, map Salesforce to match, and get you live faster—with native solutions and no integration risk.",
    studioIcon: getAssetUrl("salesforce-studio/salesforce-studio-layer-5.webp"),
    studioLabel: "Salesforce Studio",
    solutionsTitle: "Typical solutions:",
    solutions: [
      "Salesforce consulting",
      "Platform customization",
      "CRM integration",
      "Data migration",
      "AppExchange development",
      "Managed services and admin",
    ],
  },
  {
    category: "Security",
    title: "Information security services",
    description:
      "Your company needs more than strong cybersecurity—it needs a strategic information security and compliance program that protects assets, infrastructure, and data privacy.",
    studioIcon: getAssetUrl(
      "information-security-studio/information-security-studio-empower.webp",
    ),
    studioLabel: "Information Security Studio",
    solutionsTitle: "Typical solutions:",
    solutions: [
      "Governance, risk, and compliance",
      "Virtual CISO as a Service",
      "Cloud and network security",
      "Application security",
      "Data protection assessments",
      "Security awareness programs",
    ],
  },
];

export function AiChangeSection() {
  const cards = data.map((card) => <Card key={card.title} card={card} />);

  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#0F0E0F] px-6 py-16 lg:px-10 lg:py-24">
      <Image
        src={getAssetUrl("solutions/innovating/solutions-innovating-bg.webp")}
        alt=""
        fill
        quality={80}
        sizes="100vw"
        className="pointer-events-none z-0 object-cover object-bottom"
      />
      <h2 className="relative z-10 max-w-[1440px] text-center text-[1.0625rem] font-bold leading-[1.625rem] text-[#FAF8F9] lg:text-[2.5rem] lg:leading-[3rem]">
        AI has changed how software is built.
      </h2>
      <h3 className="relative z-10 mt-3 max-w-[960px] text-center text-[0.9375rem] font-bold leading-6 text-[#FAF8F9] lg:mt-4 lg:text-[1.75rem] lg:leading-9">
        We help enterprises capitalize on that change by delivering more
        business solutions—not just more code.
      </h3>
      <div className="relative z-10 w-full">
        <Carousel items={cards} />
      </div>
      <p className="relative z-10 mt-10 max-w-[1440px] text-center text-[0.9375rem] font-bold leading-6 text-[#FAF8F9] lg:mt-16 lg:text-[2rem] lg:leading-[2.5rem]">
        Build more. Modernize faster. Innovate continuously.
      </p>
    </section>
  );
}
