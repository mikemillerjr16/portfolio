/**
 * Data for the interactive architecture diagrams. Keyed by architecture slug.
 * Coordinates are percentages (0–100) of the diagram canvas, referencing the
 * CENTER of each node. Edges reference node ids.
 *
 * Each node carries the explanation shown when it's selected — this doubles as
 * the accessible text description (rendered as a list for assistive tech).
 */

export type DiagramNode = {
  id: string;
  num: number;
  label: string;
  x: number;
  y: number;
  /** Grouping tint for the node. */
  tone?: "input" | "retrieval" | "generation" | "control" | "output";
  purpose: string;
  why: string;
  alternatives: string;
  risks: string;
};

export type DiagramEdge = {
  from: string;
  to: string;
  /** Optional short label rendered near the edge midpoint. */
  label?: string;
};

export type ArchitectureDiagram = {
  title: string;
  summary: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

export const architectureDiagrams: Record<string, ArchitectureDiagram> = {
  "enterprise-rag": {
    title: "Enterprise RAG — request flow",
    summary:
      "A user question is grounded in the organization's own documents before an LLM answers, with guardrails and observability around the loop. Select any numbered component to see why it's there and what it trades off.",
    nodes: [
      {
        id: "user",
        num: 1,
        label: "User / Client",
        x: 8,
        y: 46,
        tone: "input",
        purpose:
          "The person (or upstream app) asking a question in natural language.",
        why: "Everything is designed backward from what the user actually needs: a trustworthy, grounded answer with sources.",
        alternatives:
          "Could be a chat UI, an internal tool, or another service calling the API.",
        risks:
          "Ambiguous or adversarial questions arrive here — input handling and rate limiting matter from the first hop.",
      },
      {
        id: "api",
        num: 2,
        label: "Orchestration / API",
        x: 27,
        y: 46,
        tone: "control",
        purpose:
          "Receives the query, coordinates retrieval and generation, and enforces auth and request policy.",
        why: "A thin orchestration layer keeps the flow explicit and testable, and is the natural place for access control and logging.",
        alternatives:
          "A managed agent framework can play this role; for simple RAG a plain function is clearer and cheaper.",
        risks:
          "Becomes a bottleneck or a god-object if too much logic accretes here. Keep it a coordinator, not a kitchen sink.",
      },
      {
        id: "retrieval",
        num: 3,
        label: "Embed + Retrieve",
        x: 47,
        y: 28,
        tone: "retrieval",
        purpose:
          "Embeds the query and retrieves the most relevant passages from the vector index.",
        why: "Retrieval is what grounds the answer in real, current, permissioned data instead of the model's parametric memory.",
        alternatives:
          "Hybrid (keyword + vector) retrieval and re-ranking improve quality; pure vector search is the simplest starting point.",
        risks:
          "Poor chunking or embeddings mean the right passage is never retrieved — the most common cause of weak RAG answers.",
      },
      {
        id: "index",
        num: 4,
        label: "Vector index",
        x: 47,
        y: 68,
        tone: "retrieval",
        purpose:
          "Stores document embeddings and serves nearest-neighbor search.",
        why: "A purpose-built index makes semantic search fast and scalable as the corpus grows.",
        alternatives:
          "Managed vector services vs. a database with a vector extension — trade operational simplicity against cost and control.",
        risks:
          "Staleness: if ingestion lags, the index answers from old documents. Freshness monitoring is essential.",
      },
      {
        id: "sources",
        num: 5,
        label: "Source documents",
        x: 27,
        y: 84,
        tone: "input",
        purpose:
          "The authoritative corpus — policies, SOPs, wikis — chunked and embedded during ingestion.",
        why: "The whole value of RAG is answering from these, so their quality and permissions define the ceiling of the system.",
        alternatives:
          "Batch ingestion vs. streaming updates, depending on how fast the source of truth changes.",
        risks:
          "Ingesting content a user isn't entitled to see leaks it through answers. Permissions must survive into retrieval.",
      },
      {
        id: "llm",
        num: 6,
        label: "LLM generation",
        x: 69,
        y: 28,
        tone: "generation",
        purpose:
          "Composes an answer using only the retrieved passages as context.",
        why: "The model turns retrieved facts into a fluent, useful answer — its job is synthesis, not recall.",
        alternatives:
          "Model size is a cost/quality dial; a smaller grounded model often beats a larger ungrounded one for this task.",
        risks:
          "Given weak context it will still produce a confident answer. Constrain it to cite, and to abstain when unsure.",
      },
      {
        id: "guardrails",
        num: 7,
        label: "Grounding & guardrails",
        x: 69,
        y: 64,
        tone: "control",
        purpose:
          "Checks that the answer is supported by its cited sources and applies safety/policy filters.",
        why: "This is what makes the output reviewable and safe to show — the difference between a demo and production.",
        alternatives:
          "Range from lightweight citation checks to full LLM-as-judge evaluation, depending on stakes.",
        risks:
          "Too strict and it blocks good answers; too loose and hallucinations slip through. It needs tuning against real data.",
      },
      {
        id: "answer",
        num: 8,
        label: "Answer + citations",
        x: 90,
        y: 46,
        tone: "output",
        purpose:
          "The grounded response returned to the user, with links back to sources.",
        why: "Citations make the answer checkable, which is the foundation of user trust in an AI system.",
        alternatives:
          "Return confidence signals or 'no answer found' explicitly rather than forcing a response.",
        risks:
          "Citations that don't actually support the claim are worse than none — they manufacture false confidence.",
      },
      {
        id: "observability",
        num: 9,
        label: "Observability & evaluation",
        x: 50,
        y: 96,
        tone: "control",
        purpose:
          "Logs queries, retrieved sources, and outputs; runs offline evaluation on a labeled set.",
        why: "A non-deterministic system needs continuous measurement to catch drift and regressions you can't see by eye.",
        alternatives:
          "From basic logging to full tracing with automated eval in CI — scale it to the stakes of the use case.",
        risks:
          "Skipping this means you find out about quality problems from users, not from your own instruments.",
      },
    ],
    edges: [
      { from: "user", to: "api", label: "question" },
      { from: "api", to: "retrieval", label: "query" },
      { from: "retrieval", to: "index" },
      { from: "sources", to: "index", label: "ingest" },
      { from: "retrieval", to: "llm", label: "context" },
      { from: "llm", to: "guardrails" },
      { from: "guardrails", to: "answer", label: "verified" },
    ],
  },
};
