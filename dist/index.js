#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// ─── opencode-prompt-coach MCP server ────────────────────────────────────────
// Exposes a single MCP prompt named "coach".
// opencode maps MCP prompts → slash commands, so this becomes /coach in the UI.
//
// Frameworks supported:
//   RTF     – Role · Task · Format
//   CODE    – Context · Objective · Details · Expectations
//   CO-STAR – Context · Objective · Style · Tone · Audience · Response format
//   RISEN   – Role · Instructions · Steps · End goal · Narrowing
//   RACE    – Role · Action · Context · Expectation
//   CoT     – Chain of Thought
//   ToT     – Tree of Thoughts
//   CARE    – Context · Action · Result · Example
// ─────────────────────────────────────────────────────────────────────────────
const COACH_PROMPT = `You are an expert AI prompt coach for software developers.
The developer wants you to evaluate and improve this prompt:

"{prompt}"

---

## Step 1 — Select the best-fit framework

Choose ONE framework based on what the prompt is trying to do:

| Framework | Best for |
|-----------|---------|
| RTF (Role · Task · Format) | Code writing, debugging, focused docs |
| CODE (Context · Objective · Details · Expectations) | Code that must fit an existing codebase |
| CO-STAR (Context · Objective · Style · Tone · Audience · Response) | Docs, READMEs, explanations for a specific audience |
| RISEN (Role · Instructions · Steps · End goal · Narrowing) | Multi-step tasks: CI/CD, migrations, refactors |
| RACE (Role · Action · Context · Expectation) | Code reviews and targeted fixes |
| CoT — Chain of Thought | Debugging tricky logic, algorithm design |
| ToT — Tree of Thoughts | Architecture decisions, comparing design options |
| CARE (Context · Action · Result · Example) | Teaching patterns, before/after code transformations |

Selection guide:
- Simple, single output needed → RTF
- Needs to fit existing code → CODE
- Output is prose/docs for an audience → CO-STAR
- Multi-step process or workflow → RISEN
- Code review or targeted fix → RACE
- Debug or reasoning task → CoT
- Comparing design options → ToT
- Teaching with a before/after example → CARE

---

## Step 2 — Produce the coaching report

Format your response exactly like this:

---

### 🎯 Prompt Coach Report

**Original:** "{prompt}"

---

**📊 Rating:** X/10 — [Poor | Fair | Good | Excellent | Perfect]

Rating guide: 1–3 Poor · 4–5 Fair · 6–7 Good · 8–9 Excellent · 10 Perfect

---

**Framework:** [NAME] — [full name]
**Why:** [1 sentence]

**Component breakdown:**
- ✓/✗ [Component]: [what was found, or "missing"]
(one line per component of the chosen framework)

---

**⚠️ Issues** (up to 3):
- ...

**💪 Strengths** (up to 3):
- ...

---

**❓ Clarifying questions** (only if too vague to improve without answers):
- ...

---

**✨ Improved prompt:**

\`\`\`
[Fully rewritten prompt using the chosen framework. Write it in full — no placeholders.]
\`\`\`

---

**💰 Cost tip:** [One specific tip to reduce token usage for this type of request]

**📖 Summary:** [2 sentences: what changed and why]`;
// ── Server setup ─────────────────────────────────────────────────────────────
const server = new McpServer({
    name: "opencode-prompt-coach",
    version: "1.0.0",
});
server.registerPrompt("coach", {
    title: "Prompt Coach",
    description: "Evaluate and improve your AI prompt using 8 proven frameworks (RTF, CODE, CO-STAR, RISEN, RACE, CoT, ToT, CARE). Returns a rating, component breakdown, and a fully rewritten prompt.",
    argsSchema: {
        prompt: z
            .string()
            .describe("The prompt you want to evaluate and improve"),
    },
}, ({ prompt }) => ({
    messages: [
        {
            role: "user",
            content: {
                type: "text",
                text: COACH_PROMPT.replace(/\{prompt\}/g, prompt),
            },
        },
    ],
}));
// ── Transport ─────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
