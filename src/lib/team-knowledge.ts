/**
 * TEAM International knowledge pack for AI recommendation prompts.
 * Sources: Services overview (Services.pdf) + expert team (Team.pdf).
 * Methodology remains an interim stub until a dedicated delivery doc arrives.
 */

export const TEAM_POSITIONING = `
TEAM International designs, builds, modernizes, and operates custom digital solutions
with AI-augmented engineering teams. Clients typically need help to understand the
problem, design the right approach, build and integrate the solution, then continuously
improve it in production.
`.trim();

export const SERVICE_PILLARS = [
  {
    id: "custom-enterprise-software",
    title: "Custom enterprise software development",
    summary:
      "Replace or extend CRM, ERP, HR, Finance, legacy, cloud, and AI-adjacent systems with a custom platform using composable architecture—so the business owns workflows that off-the-shelf tools cannot cover well.",
    examples: [
      "Composable custom platforms that sit beside or replace fragmented CRM/ERP modules",
      "Industry-specific workflows that packages cannot express without heavy customization",
      "Cloud-native rebuilds that keep core processes intact while improving delivery speed",
    ],
  },
  {
    id: "ai-implementation",
    title: "AI implementation for existing companies",
    summary:
      "Move from problem → data readiness → opportunity → PoC → production → continuous improvement. Typical domains: customer service, operations, finance, and HR.",
    examples: [
      "Customer service assist and triage",
      "Operations forecasting and exception handling",
      "Finance document processing and controls",
      "HR knowledge retrieval and workflow assist",
    ],
  },
  {
    id: "ai-agents-workflows",
    title: "AI agents and intelligent workflows",
    summary:
      "Event → agent → data → recommendation → human approve → execute. Agents augment teams with controlled automation rather than unsupervised takeover.",
    examples: [
      "Approval-gated agents for operational decisions",
      "Workflow orchestration across ERP/CRM and custom tools",
      "Human-in-the-loop recommendations before system writes",
    ],
  },
  {
    id: "legacy-modernization",
    title: "Legacy system modernization",
    summary:
      "Analyze → document → expose APIs → modern UI → introduce AI where data quality allows → gradually replace. Prefer phased modernization over big-bang rewrites.",
    examples: [
      "API wrappers around legacy cores",
      "Modern UI layers without ripping out the backend immediately",
      "Selective AI on documented, reliable data paths",
      "Incremental replacement of high-friction modules",
    ],
  },
  {
    id: "data-ai-platforms",
    title: "Data and AI platforms",
    summary:
      "Integration, warehouses, BI, predictive analytics, and knowledge bases that make Levels 3–4 AI possible and trustworthy.",
    examples: [
      "System integration and trusted data pipelines",
      "Warehouses and BI for decision support",
      "Predictive analytics on operational data",
      "Knowledge bases grounding assistants and agents",
    ],
  },
] as const;

/** TEAM focuses AI maturity conversations on Levels 3 and 4 only. */
export const AI_MATURITY_FOCUS = {
  level3: {
    name: "Level 3 — Business applications",
    description:
      "AI embedded in business apps and workflows (assist, recommend, automate with oversight) where process and data are clear enough to deliver measurable outcomes.",
  },
  level4: {
    name: "Level 4 — Enterprise platforms",
    description:
      "Enterprise-scale AI platforms: shared data foundations, agents/workflows across systems, governance, and continuous improvement in production.",
  },
  note: "Do not recommend Level 1–2 (generic chatbots / isolated experiments) as the primary path. Frame recommendations toward Level 3 and Level 4 outcomes.",
} as const;

/**
 * Interim methodology stub (swap when dedicated methodology doc arrives).
 * Derived from Services PDF client journey + TEAM delivery language.
 */
export const INTERIM_METHODOLOGY = `
TEAM delivery pattern (interim):
1. Discover — clarify industry problem/opportunity, systems landscape (ERP/CRM/custom), data readiness, and desired business outcome.
2. Design — map the path: new AI-powered solution, legacy modernization, or hybrid; choose the relevant Services pillar(s).
3. Build — AI-augmented engineering teams implement composable solutions with human review gates.
4. Integrate — connect ERP, CRM, custom systems, and hosting strategy without disrupting critical operations.
5. Operate & improve — production rollout with continuous improvement, measuring outcomes and refining agents/workflows.
Prefer phased, low-disruption increments over big-bang replacement.
`.trim();

/**
 * Expert team from Team.pdf — world-class experienced delivery roles.
 * Prefer these exact roles when filling the "teamInvolved" recommendation section.
 */
export const TEAM_ROLES = {
  headline:
    "World-class experienced team spanning product, architecture, engineering, AI, quality, and cloud.",
  coreRoles: [
    "Product/Business Analyst",
    "Solution Architect",
    "Senior Full-Stack Developer",
    "AI Engineer",
    "QA Automation Engineer",
    "DevOps/Cloud Engineer",
  ],
  detailedRoles: [
    {
      role: "Product Manager",
      focus: "Business vision and priorities",
    },
    {
      role: "Business Analyst",
      focus: "Requirements and process analysis",
    },
    {
      role: "Solution Architect",
      focus: "Overall technical architecture",
    },
    {
      role: "UX/UI Designer",
      focus: "User experience",
    },
    {
      role: "Front-End Developer",
      focus: "User interface",
    },
    {
      role: "Back-End Developer",
      focus: "APIs, business logic, integrations",
    },
    {
      role: "AI Engineer",
      focus:
        "AI architecture, LLMs, RAG, agents, prompt engineering, evaluation, AI integration",
    },
    {
      role: "Data Engineer",
      focus: "Data pipelines and storage",
    },
    {
      role: "DevOps Engineer",
      focus: "Infrastructure, CI/CD, deployment",
    },
    {
      role: "QA Automation Engineer",
      focus: "Testing and quality assurance",
    },
    {
      role: "Security Engineer",
      focus: "Security, compliance, governance",
    },
  ],
} as const;

function formatTeamRolesForPrompt(): string {
  const detailed = TEAM_ROLES.detailedRoles
    .map((entry) => `- ${entry.role} — ${entry.focus}`)
    .join("\n");

  return `
${TEAM_ROLES.headline}

Core roles often highlighted for client engagements:
${TEAM_ROLES.coreRoles.map((role) => `- ${role}`).join("\n")}

Detailed roles (use these names when describing team involved):
${detailed}

Guidance: pick the smallest credible mix for the recommended path. Example mappings:
- Custom / modernization → Product Manager or Business Analyst, Solution Architect, Front-End + Back-End (or Senior Full-Stack), QA Automation, DevOps
- AI implementation / agents → AI Engineer, Data Engineer, Solution Architect, Back-End, Security Engineer, QA Automation
- Data & AI platforms → Data Engineer, AI Engineer, Solution Architect, DevOps, Security Engineer
`.trim();
}

export function buildTeamKnowledgePromptBlock(): string {
  const pillars = SERVICE_PILLARS.map(
    (pillar, index) =>
      `${index + 1}. ${pillar.title}\n   ${pillar.summary}\n   Examples: ${pillar.examples.join("; ")}`,
  ).join("\n");

  return `
# TEAM International knowledge pack (authoritative)

## Positioning
${TEAM_POSITIONING}

## Service pillars (map assessment answers to these; do not invent capabilities outside this pack)
${pillars}

## AI maturity focus
- ${AI_MATURITY_FOCUS.level3.name}: ${AI_MATURITY_FOCUS.level3.description}
- ${AI_MATURITY_FOCUS.level4.name}: ${AI_MATURITY_FOCUS.level4.description}
- ${AI_MATURITY_FOCUS.note}

## Methodology (interim)
${INTERIM_METHODOLOGY}

## Expert team roles (from Team.pdf — authoritative for teamInvolved)
${formatTeamRolesForPrompt()}
`.trim();
}
