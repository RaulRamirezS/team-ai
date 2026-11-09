/**
 * Mock "instant technical solution strategy" engine.
 *
 * Stands in for an LLM until an API key is available. The public surface is
 * `generateSolutionStrategy(prompt, signal)`; to go live, keep the signature
 * and swap the body for a `fetch("/api/ai/strategy", ...)` call that returns
 * a `SolutionStrategy`.
 *
 * Content is grounded ONLY in TEAM's published studios and engagement models.
 * It never promises prices, deadlines, or named clients.
 */

export type StudioId =
  | "ai"
  | "software"
  | "data"
  | "security"
  | "managed"
  | "implementation";

export type EngagementModelId = "digital-engineering" | "dedicated" | "cloud";

type Studio = {
  id: StudioId;
  name: string;
  focus: string;
  keywords: readonly string[];
  deliverables: readonly string[];
  /** Approach phases when this studio leads the engagement. */
  phases: readonly { title: string; detail: string }[];
};

type EngagementModel = {
  id: EngagementModelId;
  name: string;
  description: string;
  keywords: readonly string[];
  fit: string;
};

const STUDIOS: readonly Studio[] = [
  {
    id: "ai",
    name: "AI/Transformation Studio",
    focus:
      "Production-ready AI systems, generative AI, LLM integration, and intelligent automation.",
    keywords: [
      "ai",
      "artificial intelligence",
      "llm",
      "gpt",
      "generative",
      "genai",
      "agent",
      "agents",
      "chatbot",
      "copilot",
      "machine learning",
      "ml",
      "predict",
      "forecast",
      "automate",
      "automation",
      "intelligent",
      "workflow",
    ],
    deliverables: [
      "Prioritized AI use cases tied to measurable business value",
      "LLM or agent integration with your existing systems",
      "Governance, monitoring, and human-in-the-loop controls",
    ],
    phases: [
      {
        title: "Identify high-value use cases",
        detail:
          "Map your processes and rank AI opportunities by impact, feasibility, and data readiness.",
      },
      {
        title: "Prove it with a focused pilot",
        detail:
          "Build a narrow, production-minded pilot that integrates with the systems your teams already use.",
      },
      {
        title: "Add governance and security",
        detail:
          "Introduce access controls, monitoring, and human approval steps before scaling.",
      },
      {
        title: "Scale and improve",
        detail:
          "Extend to adjacent workflows and keep tuning with real usage data.",
      },
    ],
  },
  {
    id: "software",
    name: "Digital Software Studio",
    focus:
      "Turnkey and scalable custom software development using agile squads and AI-assisted workflows.",
    keywords: [
      "app",
      "application",
      "platform",
      "portal",
      "web",
      "mobile",
      "ios",
      "android",
      "custom software",
      "build",
      "develop",
      "product",
      "mvp",
      "legacy",
      "modernize",
      "modernization",
      "rewrite",
      "dashboard",
      "internal tool",
      "erp",
      "website",
    ],
    deliverables: [
      "A modular architecture that integrates with your current platforms",
      "Incremental releases from an agile squad",
      "AI-assisted engineering to speed up delivery and testing",
    ],
    phases: [
      {
        title: "Discover and document",
        detail:
          "Clarify goals, users, and the existing architecture so scope stays realistic.",
      },
      {
        title: "Design the target architecture",
        detail:
          "Define a composable design that connects to existing systems instead of replacing everything at once.",
      },
      {
        title: "Build in agile increments",
        detail:
          "Ship working slices every sprint, with AI-assisted development and QA automation.",
      },
      {
        title: "Launch, operate, and evolve",
        detail:
          "Release to production, then keep improving based on usage and feedback.",
      },
    ],
  },
  {
    id: "data",
    name: "Data Studio",
    focus:
      "Data engineering, analytics, and data security driven by insights.",
    keywords: [
      "data",
      "analytics",
      "bi",
      "business intelligence",
      "warehouse",
      "lake",
      "pipeline",
      "etl",
      "report",
      "reporting",
      "insight",
      "insights",
      "knowledge base",
      "integration",
      "silo",
      "silos",
      "metrics",
    ],
    deliverables: [
      "A unified, trustworthy data foundation",
      "Analytics and dashboards your teams can act on",
      "An AI-ready architecture with secure access to company data",
    ],
    phases: [
      {
        title: "Assess data sources and quality",
        detail:
          "Inventory systems, owners, and quality issues that limit decisions today.",
      },
      {
        title: "Integrate and model",
        detail:
          "Build pipelines into a warehouse or lakehouse with a clear, governed data model.",
      },
      {
        title: "Deliver analytics",
        detail:
          "Launch dashboards and predictive analytics for the highest-value questions first.",
      },
      {
        title: "Prepare for AI",
        detail:
          "Expose governed data to AI use cases with secure, auditable access.",
      },
    ],
  },
  {
    id: "security",
    name: "Information Security Studio",
    focus:
      "Cybersecurity solutions, compliance standards, and risk mitigation.",
    keywords: [
      "security",
      "secure",
      "cyber",
      "cybersecurity",
      "compliance",
      "soc",
      "soc2",
      "iso",
      "hipaa",
      "gdpr",
      "pci",
      "risk",
      "audit",
      "privacy",
      "vulnerability",
      "pentest",
      "ciso",
    ],
    deliverables: [
      "A risk and compliance gap assessment",
      "A prioritized remediation roadmap",
      "Ongoing security and awareness practices",
    ],
    phases: [
      {
        title: "Assess risk and compliance gaps",
        detail:
          "Review governance, infrastructure, applications, and data protection against the standards that matter to you.",
      },
      {
        title: "Prioritize remediation",
        detail:
          "Rank findings by business risk and agree on a realistic roadmap.",
      },
      {
        title: "Implement controls",
        detail:
          "Strengthen cloud, network, and application security and data protection.",
      },
      {
        title: "Sustain the program",
        detail:
          "Put monitoring, training, and periodic reviews in place to stay compliant.",
      },
    ],
  },
  {
    id: "managed",
    name: "Managed & Professional Services Studio",
    focus:
      "Cloud solutions, infrastructure management, and DevOps support (official AWS and Azure partner).",
    keywords: [
      "cloud",
      "aws",
      "azure",
      "devops",
      "infrastructure",
      "migrate",
      "migration",
      "hosting",
      "kubernetes",
      "ci/cd",
      "uptime",
      "monitoring",
      "on prem",
      "on premise",
      "scalability",
      "scale",
      "reliability",
    ],
    deliverables: [
      "A cloud migration or optimization plan on AWS or Azure",
      "Automated DevOps pipelines and infrastructure as code",
      "Ongoing infrastructure management and support",
    ],
    phases: [
      {
        title: "Assess your current environment",
        detail:
          "Review workloads, dependencies, costs, and reliability requirements.",
      },
      {
        title: "Design the target cloud setup",
        detail:
          "Plan the landing zone, migration waves, and DevOps tooling on AWS or Azure.",
      },
      {
        title: "Migrate and automate",
        detail:
          "Move workloads in stages and automate delivery with CI/CD and infrastructure as code.",
      },
      {
        title: "Operate and optimize",
        detail:
          "Run day-to-day operations and keep tuning performance, cost, and resilience.",
      },
    ],
  },
  {
    id: "implementation",
    name: "Software Implementation & Salesforce Studios",
    focus:
      "Enterprise software execution, CRM strategy, and platform integration (such as Salesforce and Sitecore).",
    keywords: [
      "salesforce",
      "crm",
      "sitecore",
      "cms",
      "sales",
      "customer 360",
      "implementation",
      "appexchange",
      "marketing cloud",
      "service cloud",
      "lead",
      "pipeline management",
    ],
    deliverables: [
      "A CRM or platform strategy aligned to your real processes",
      "Configuration, customization, and integration with your stack",
      "Data migration and managed administration",
    ],
    phases: [
      {
        title: "Map your processes",
        detail:
          "Start from how your teams actually work, then align the platform to match.",
      },
      {
        title: "Configure and customize",
        detail:
          "Set up the platform with native capabilities first, extending only where needed.",
      },
      {
        title: "Integrate and migrate data",
        detail:
          "Connect to ERP and other systems and move data with validation at each step.",
      },
      {
        title: "Go live and support",
        detail:
          "Launch with training, then provide ongoing administration and enhancements.",
      },
    ],
  },
];

const ENGAGEMENT_MODELS: readonly EngagementModel[] = [
  {
    id: "dedicated",
    name: "Dedicated Delivery Team",
    description:
      "Staff augmentation and full engineering squads that integrate into your internal teams and processes under your direction.",
    keywords: [
      "team",
      "staff",
      "augment",
      "augmentation",
      "hire",
      "hiring",
      "developers",
      "engineers",
      "extend",
      "capacity",
      "in house",
      "our process",
      "talent",
    ],
    fit: "You already have direction and processes, and need skilled engineers working as part of your team.",
  },
  {
    id: "cloud",
    name: "Cloud Management",
    description:
      "24/5 or 24/7 on-demand cloud infrastructure, DevOps-as-a-service, and system support.",
    keywords: [
      "24/7",
      "24/5",
      "operate",
      "operations",
      "managed",
      "devops",
      "cloud",
      "infrastructure",
      "uptime",
      "monitoring",
      "sla",
    ],
    fit: "Your priority is keeping systems reliable and supported around the clock.",
  },
  {
    id: "digital-engineering",
    name: "Digital Engineering",
    description:
      "End-to-end SDLC management driven by agile Scrum squads for dynamic projects.",
    keywords: [
      "build",
      "launch",
      "new",
      "mvp",
      "product",
      "end to end",
      "from scratch",
      "project",
      "platform",
      "modernize",
      "transform",
    ],
    fit: "You want a partner to own delivery end to end, with agile squads adapting as the project evolves.",
  },
];

export type StrategyStudio = {
  id: StudioId;
  name: string;
  focus: string;
  role: "lead" | "supporting";
  reason: string;
};

export type SolutionStrategy = {
  summary: string;
  /** Keywords from the prompt that shaped the result (for transparency). */
  detectedTopics: string[];
  studios: StrategyStudio[];
  deliverables: string[];
  approach: { title: string; detail: string }[];
  engagementModel: {
    id: EngagementModelId;
    name: string;
    description: string;
    reason: string;
  };
  nextStep: string;
};

function normalize(text: string) {
  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z0-9/ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return ` ${cleaned} `;
}

function matchKeywords(haystack: string, keywords: readonly string[]) {
  return keywords.filter((keyword) => haystack.includes(` ${keyword} `));
}

function formatList(items: string[]) {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function buildStrategy(prompt: string): SolutionStrategy {
  const haystack = normalize(prompt);

  const scored = STUDIOS.map((studio) => ({
    studio,
    hits: matchKeywords(haystack, studio.keywords),
  }))
    .filter(({ hits }) => hits.length > 0)
    .sort((a, b) => b.hits.length - a.hits.length);

  // Nothing matched: a sensible default for an open-ended request.
  const picked =
    scored.length > 0
      ? scored.slice(0, 3)
      : [
          { studio: STUDIOS.find((s) => s.id === "software")!, hits: [] },
          { studio: STUDIOS.find((s) => s.id === "ai")!, hits: [] },
        ];

  const lead = picked[0].studio;
  const detectedTopics = [
    ...new Set(picked.flatMap(({ hits }) => hits)),
  ].slice(0, 5);

  const studios: StrategyStudio[] = picked.map(({ studio, hits }, index) => ({
    id: studio.id,
    name: studio.name,
    focus: studio.focus,
    role: index === 0 ? "lead" : "supporting",
    reason:
      hits.length > 0
        ? `Your description touches on ${formatList(hits.slice(0, 3).map((h) => `“${h}”`))}.`
        : index === 0
          ? "A strong starting point for turning an open-ended need into a scoped solution."
          : "Adds AI-enabled capabilities on top of the core build.",
  }));

  const modelScores = ENGAGEMENT_MODELS.map((model) => ({
    model,
    hits: matchKeywords(haystack, model.keywords),
  })).sort((a, b) => b.hits.length - a.hits.length);

  // Cloud-led work defaults to Cloud Management; everything else to
  // Digital Engineering unless the prompt clearly asks for extra capacity.
  const defaultModelId: EngagementModelId =
    lead.id === "managed" ? "cloud" : "digital-engineering";
  const bestModel =
    modelScores[0].hits.length > 0
      ? modelScores[0]
      : {
          model: ENGAGEMENT_MODELS.find((m) => m.id === defaultModelId)!,
          hits: [] as string[],
        };

  const supportingNames = studios
    .filter((s) => s.role === "supporting")
    .map((s) => s.name);

  const summary =
    `Based on your description, the best fit is the ${lead.name}. ` +
    `${lead.focus} ` +
    (supportingNames.length > 0
      ? `We'd bring in ${formatList(supportingNames)} to cover the rest of what you described. `
      : "") +
    "We'd approach it with composable architecture: modular systems that integrate with what you already run, rather than replacing everything at once.";

  return {
    summary,
    detectedTopics,
    studios,
    deliverables: [...lead.deliverables],
    approach: lead.phases.map((phase) => ({ ...phase })),
    engagementModel: {
      id: bestModel.model.id,
      name: bestModel.model.name,
      description: bestModel.model.description,
      reason:
        bestModel.hits.length > 0
          ? `${bestModel.model.fit} You mentioned ${formatList(bestModel.hits.slice(0, 3).map((h) => `“${h}”`))}.`
          : bestModel.model.fit,
    },
    nextStep:
      "Share a few details about your industry and current systems in the AI readiness assessment, and we'll refine this into a tailored recommendation. Timelines and team shape are confirmed after a discovery conversation.",
  };
}

/**
 * Resolves with a strategy for the given project description.
 * Simulates model latency; rejects with an `AbortError` if cancelled.
 */
export function generateSolutionStrategy(
  prompt: string,
  signal?: AbortSignal,
): Promise<SolutionStrategy> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(
      () => resolve(buildStrategy(prompt)),
      1400 + Math.random() * 600,
    );

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}
