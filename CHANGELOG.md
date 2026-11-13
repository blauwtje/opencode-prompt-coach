# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Nothing yet.

---

## [1.0.0] - 2025-03-08

### Added
- Initial release of `opencode-prompt-coach`.
- `/coach <prompt>` slash command that intercepts input via `tui.command.execute`.
- Eight prompt engineering frameworks: RTF, CODE, CO-STAR, RISEN, RACE, CoT, ToT, CARE.
- Automatic framework selection based on the prompt's implied task.
- Component breakdown table showing which framework parts are present vs. missing.
- 1–10 rating with label (Poor / Fair / Good / Excellent / Perfect).
- Up to 3 issues and 3 strengths surfaced from the original prompt.
- Clarifying questions when the prompt is too vague to improve.
- Fully rewritten improved prompt using the selected framework's structure.
- Cost-effectiveness tip tailored to the prompt type.
- Markdown fallback command (`commands/coach.md`) for use without the TypeScript plugin.
- GitHub Actions CI pipeline (typecheck, lint, test, build).
- GitHub Actions release pipeline (npm publish + GitHub release on version tag).
- AGENTS.md with AI assistant guidelines.
- CONTRIBUTING.md, issue templates, and PR template.

[Unreleased]: https://github.com/your-org/opencode-prompt-coach/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-org/opencode-prompt-coach/releases/tag/v1.0.0
