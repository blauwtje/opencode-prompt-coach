# opencode-prompt-coach

> **Fork note (v1.0.8):** this fork exists because the published package passes a
> `z.object({...})` as `argsSchema` to `McpServer.registerPrompt`. MCP SDK 1.32
> expects a raw shape, so the server crashes on startup with
> `TypeError: Cannot read properties of null (reading '_zod')`. The one-line fix
> passes the raw shape instead. Dependencies are pinned to the tested versions.
> Install with `npm install -g github:blauwtje/opencode-prompt-coach`.

> An [opencode](https://opencode.ai) plugin that evaluates your AI prompts and rewrites them using established prompt engineering frameworks — helping beginners get better results while spending fewer tokens.

[![CI](https://github.com/your-org/opencode-prompt-coach/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/opencode-prompt-coach/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/opencode-prompt-coach)](https://www.npmjs.com/package/opencode-prompt-coach)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## What it does

Type `/coach` followed by your prompt inside opencode:

```
/coach fix my auth function
```

The coach evaluates it, picks the best-fit framework, and returns a report like this:

```
╔════════════════════════════════════════════════════════╗
║            🎯  PROMPT COACH  REPORT                    ║
╚════════════════════════════════════════════════════════╝

━━━  YOUR PROMPT  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   "fix my auth function"

━━━  RATING  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ★☆☆☆☆  2/10 — Poor

━━━  FRAMEWORK SELECTED  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🏁  RACE  —  Role · Action · Context · Expectation
   📌 Best for: Code reviews, targeted fixes
   💬 Why: The prompt implies a targeted fix — RACE's direct structure fits best.

━━━  COMPONENT BREAKDOWN  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✗ Role             (missing)
   ✗ Action           vague — "fix" without specifying what is broken
   ✗ Context          (missing)
   ✗ Expectation      (missing)
   ⚠️  Missing: Role, Context, Expectation

━━━  ISSUES  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✗ No file, function, or error specified
   ✗ "Fix" is undefined — fix what behaviour exactly?
   ✗ No expected output or constraint given

━━━  IMPROVED PROMPT  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Role: Senior backend developer.
Action: Fix the bug in validateToken() in src/auth/auth.service.ts.
Context: When the JWT is expired the function throws TypeError instead of returning
false, crashing the middleware and skipping the 401 response.
Expectation: Return false for expired tokens. Keep existing passing tests green. Code only.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Cost tip: Name the specific file and line instead of describing the symptom.
```

---

## The 8 frameworks

The coach selects from eight developer-focused prompt engineering frameworks. See [`docs/frameworks.md`](docs/frameworks.md) for the full reference with before/after examples.

| | Framework | Components | Best for |
|--|-----------|-----------|---------|
| ⚡ | **RTF** | Role · Task · Format | Code writing, debugging, focused docs |
| 🧱 | **CODE** | Context · Objective · Details · Expectations | Context-aware code matching your codebase |
| 🌟 | **CO-STAR** | Context · Objective · Style · Tone · Audience · Response | Docs, READMEs, explanations for an audience |
| 🪜 | **RISEN** | Role · Instructions · Steps · End goal · Narrowing | Multi-step tasks: CI/CD, migrations, refactors |
| 🏁 | **RACE** | Role · Action · Context · Expectation | Code reviews and targeted fixes |
| 🧠 | **CoT** | Chain of Thought (step-by-step) | Debugging tricky logic, algorithm design |
| 🌳 | **ToT** | Tree of Thoughts (multi-path) | Architecture decisions and design trade-offs |
| 🎯 | **CARE** | Context · Action · Result · Example | Teaching patterns with before/after code |

---

## Requirements

| Tool | Version | Install |
|------|---------|---------|
| [opencode](https://opencode.ai) | latest | See [opencode docs](https://opencode.ai/docs) |
| [Bun](https://bun.sh) | ≥ 1.1 | `curl -fsSL https://bun.sh/install \| bash` |

> Bun is only needed if you are installing from source or contributing. For the npm or local-file install methods, opencode handles everything.

---

## Installation

There are three ways to install the plugin. Choose whichever fits your workflow.

---

### Method 1 — npm (recommended)

This is the simplest approach. opencode downloads and caches the package automatically at startup.

**Step 1.** Open (or create) `opencode.json` in your project root:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-prompt-coach"]
}
```

**Step 2.** Start opencode. It will install the plugin on first run.

**Step 3.** Type `/coach fix my code` to verify it works.

To install globally (available in every project), add the same line to `~/.config/opencode/opencode.json`.

---

### Method 2 — Local file (no npm account needed)

Use this if you want to run the plugin directly from source, or you are developing it.

**Step 1.** Clone the repository:

```bash
git clone https://github.com/your-org/opencode-prompt-coach.git
cd opencode-prompt-coach
```

**Step 2.** Copy (or symlink) the plugin file into your opencode plugin directory:

```bash
# Copy — project-level (this project only)
cp src/index.ts /path/to/your/project/.opencode/plugins/prompt-coach.ts

# Copy — global (every project)
cp src/index.ts ~/.config/opencode/plugins/prompt-coach.ts

# Symlink (easier when developing — changes reflect immediately)
ln -s "$(pwd)/src/index.ts" ~/.config/opencode/plugins/prompt-coach.ts
```

opencode scans the `plugins/` directory at startup and loads every `.ts` and `.js` file it finds. No further config is needed.

**Step 3.** Start opencode and type `/coach` to verify.

---

### Method 3 — Markdown command (no plugin, no Bun)

This uses opencode's built-in command system. You get the `/coach` command but without the structured JSON report — the default model handles evaluation as free-form prose.

**Step 1.** Create the commands directory if it does not exist:

```bash
mkdir -p .opencode/commands          # project-level
# or
mkdir -p ~/.config/opencode/commands  # global
```

**Step 2.** Copy the command file:

```bash
cp commands/coach.md .opencode/commands/coach.md
# or globally:
cp commands/coach.md ~/.config/opencode/commands/coach.md
```

**Step 3.** Type `/coach fix my code` in opencode.

> **Note:** Method 3 does not produce the component breakdown, star rating, or cost tips — those are only available with the TypeScript plugin (Methods 1 and 2).

---

## Usage

```
/coach <your prompt>
```

### Examples by framework

**RTF** — you need a function written:
```
/coach write a function that filters users
```

**CODE** — you need code that fits your codebase:
```
/coach add a POST /tasks endpoint to my Spring Boot Kotlin app
```

**RISEN** — multi-step workflow:
```
/coach set up GitHub Actions for my Kotlin project with JUnit 5 and Gradle
```

**RACE** — code review or targeted fix:
```
/coach review this function for null pointer risks
```

**CoT** — debugging:
```
/coach explain why my recursive DFS fails on cyclic graphs
```

**ToT** — architecture decision:
```
/coach compare three approaches to structuring a booking system API
```

**CARE** — learning a pattern:
```
/coach show me how to replace anonymous classes with lambdas in Kotlin
```

---

## Rating guide

| Score | Label | What it means |
|-------|-------|---------------|
| 1–3 | Poor | Vague, no context — will produce generic or useless output |
| 4–5 | Fair | Some info present but missing key framework components |
| 6–7 | Good | Clear intent, one or two components weak or absent |
| 8–9 | Excellent | Nearly all components present, minor tightening only |
| 10 | Perfect | Complete, well-scoped, nothing to improve |

---

## Project structure

```
opencode-prompt-coach/
├── src/
│   └── index.ts              # Plugin entry point — all logic lives here
├── test/
│   └── coach.test.ts         # Unit tests (Bun test runner)
├── commands/
│   └── coach.md              # Markdown fallback command (Method 3)
├── docs/
│   └── frameworks.md         # Full framework reference with examples
├── .github/
│   ├── workflows/
│   │   ├── ci.yml            # Typecheck, lint, test, build on every PR
│   │   └── release.yml       # Publish to npm on version tag push
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── AGENTS.md                 # Guidelines for AI coding assistants
├── CHANGELOG.md              # Version history
├── CONTRIBUTING.md           # How to contribute
├── LICENSE                   # MIT
├── SECURITY.md               # Vulnerability reporting
├── biome.json                # Linter and formatter config
├── package.json
└── tsconfig.json
```

---

## Development

```bash
# 1. Install dependencies
bun install

# 2. Type check
bun run typecheck

# 3. Run tests
bun run test

# 4. Build (outputs to dist/)
bun run build

# 5. Watch mode — rebuilds on save
bun run dev

# 6. Lint
bun run lint

# 7. Auto-fix lint issues and format
bun run lint:fix
bun run format
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full development guide including how to add new frameworks.

---

## How it works

1. The plugin registers a `tui.command.execute` hook with opencode.
2. When you type `/coach <prompt>`, the hook intercepts the command before it reaches the main AI session.
3. The prompt is sent to `claude-haiku` (fast and cheap) with a structured system prompt describing all 8 frameworks.
4. The model returns a JSON object identifying the best framework, scoring the prompt, and rewriting it.
5. The plugin formats and displays the coaching report in the TUI.
6. Your original `/coach` message is never forwarded to the main session — it is fully self-contained.

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

To report a bug: [open an issue](https://github.com/your-org/opencode-prompt-coach/issues/new?template=bug_report.md)  
To suggest a feature: [open an issue](https://github.com/your-org/opencode-prompt-coach/issues/new?template=feature_request.md)  
To discuss: [GitHub Discussions](https://github.com/your-org/opencode-prompt-coach/discussions)

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

---

## License

[MIT](LICENSE) © opencode-prompt-coach contributors
