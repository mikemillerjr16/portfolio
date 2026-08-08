/**
 * Areas of expertise, grouped into categories (not a flat keyword cloud).
 * Used on the home page and the experience "core competencies" section.
 */

export type ExpertiseGroup = {
  title: string;
  icon: "brain" | "database" | "cloud" | "users";
  blurb: string;
  skills: string[];
};

export const expertiseGroups: ExpertiseGroup[] = [
  {
    title: "Generative & Agentic AI",
    icon: "brain",
    blurb:
      "RAG systems that stay grounded in sources, and multi-agent workflows that know when to hand a decision back to a person.",
    skills: [
      "RAG",
      "Agentic workflows",
      "Multi-agent orchestration",
      "LLM evaluation",
      "Amazon Bedrock",
      "LangGraph",
      "Model Context Protocol",
    ],
  },
  {
    title: "Trust, Safety & Governance",
    icon: "database",
    blurb:
      "The unglamorous parts that decide whether an AI system ships: guardrails, source attribution, human approval, and an audit trail.",
    skills: [
      "Guardrails",
      "Human-in-the-loop",
      "Source attribution",
      "Evaluation harnesses",
      "Audit & observability",
      "AI governance",
    ],
  },
  {
    title: "Cloud & AWS Architecture",
    icon: "cloud",
    blurb:
      "Serverless, event-driven AWS designs built for cost, scale, and least-privilege security from the first diagram.",
    skills: [
      "AWS",
      "Serverless architecture",
      "Event-driven architecture",
      "Lambda & Step Functions",
      "API Gateway",
      "Infrastructure as Code",
    ],
  },
  {
    title: "Solutions & Presales",
    icon: "users",
    blurb:
      "The customer-facing craft: discovery, solution design, and explaining hard trade-offs to engineers and executives alike.",
    skills: [
      "Discovery",
      "Solution design",
      "Executive communication",
      "Technical demonstrations",
      "Proofs of concept",
      "Data platforms (Snowflake, Databricks)",
    ],
  },
];

/** Compact list for the home-page credibility strip. */
export const capabilities = [
  "Enterprise AI",
  "RAG",
  "Agentic AI",
  "Trust & Governance",
  "AWS Architecture",
  "Technical Presales",
];

/** The repeatable way Mike approaches customer engagements. */
export type ProcessStep = { title: string; description: string };

export const process: ProcessStep[] = [
  {
    title: "Start with the business problem",
    description:
      "Before any technology, get specific about the outcome that matters and how it's measured.",
  },
  {
    title: "Identify stakeholders & outcomes",
    description:
      "Map who is affected, who decides, and the measurable results that define success.",
  },
  {
    title: "Design the technical approach",
    description:
      "Choose an architecture that fits the problem — not the other way around — and name the trade-offs.",
  },
  {
    title: "Validate with demos & POCs",
    description:
      "Prove the risky parts early with prototypes that have clear, agreed success criteria.",
  },
  {
    title: "Plan for production reality",
    description:
      "Security, governance, cost, monitoring, and adoption — the difference between a demo and a system.",
  },
];
