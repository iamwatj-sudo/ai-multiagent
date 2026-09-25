---
name: project-lab04-plan
description: Frontend pre-Lab 04 checklist from the Lab 02 debate (2026-09-25) — task order, profile.ts ownership, handoffs, known UI bugs; cites DECISIONS D-ids
metadata:
  type: project
---

Lab 02 debate closed 2026-09-25 → `docs/DECISIONS.md` D1–D16 is the source of truth; re-read it, cite D-ids, don't copy.
**Why:** Frontend-scope agreements from 5 voices, 5 rounds. **How to apply:** before starting Lab 04, verify each item below against the current code (it may already be fixed).

**Order**
1. D1 first, before any UI: fix the regex in `src/lib/profile.ts` test-first. The bug: `$` with flag `m` means Bio only gets paragraph 1 and Interests gets 1/3. Tests: multi-paragraph Bio · all Interests · heading at end of file.
2. Parser must also read `## Tagline` (D4 · H1) and `## Principle` (D5 · small Hero line, not hardcoded) + course-free FALLBACK. PROFILE already has both headings; the parser doesn't read them yet.
3. Then UI: Home D3/D5 · About (Bio + Interests) · Playbook D7 · Contact D9–D11 · menu D8 · theme D13 · a11y D14 · guard D15.

**Ownership / boundaries**
- Frontend owns `profile.ts` (parser, type `Profile`, FALLBACK, tests) per D1 — no db/api.
- Don't touch `src/pages/api/interests.ts` — it calls `loadProfile()`, so fixing the parser changes its output → write a handoff to OpenCode (see "เกณฑ์พร้อม Frontend" section in DECISIONS).
- D7: Playbook must be `playbook.astro` only, never `.md` (the guard scans only `.astro/.html`).
- D8: remove `interests.astro` plus its links in `BaseLayout.astro` and `index.astro` in the same task.
- D10: one switch in one file controls banner + disabled button + hidden "ถามผม" CTA; flip it when lab05-api is green (OPEN_LOOPS). My dissent was that the flag goes stale; mitigation was accepted.

**Status 2026-09-25:** D1 + Lab 04 UI implemented (uncommitted at the time). Known bugs (unclosed </p in about, "course" in meta, English labels, raw API errors) fixed. D10 switch = CONTACT_FORM_OPEN in src/lib/features.ts. Remaining frontend loop: flip switch after lab05 green; Guestbook nav link conflicts with DECISIONS (owner to decide).
