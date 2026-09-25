# QA — Personal Site

> Lab 06

## E2E Playwright

- **When:** 2026-09-25 · **By:** Claude Code + Playwright MCP (`@playwright/mcp@0.0.82`)
- **Target:** `http://localhost:4321` (`npm run dev`, `PORT=4321` in `.env`) · branch `lab-05-backend` @ `30e1419`
- **Data:** demo only (`Demo Tester` / `demo@example.com`) → writes to local `data/site.sqlite` (gitignored)
- **Scope:** QA only — no changes to `src/` this round

| # | Step | Expected | Result |
|---|---|---|---|
| 1 | Open `/` | Name and Headline from `PROFILE.md` render | ✅ PASS: `h1` = "Your Name", headline = "Builder · learner · multi-agent course", title = "Your Name · Home" |
| 2 | Click nav → `/about` | 200, no 404 | ✅ PASS: 200 · `h1` "About" |
| 3 | Click nav → `/interests` | 200 + all interests from PROFILE | ⚠️ PARTIAL: 200, but only **1 of 3** items shows ("AI agents"). See F2 |
| 4 | Click nav → `/contact` | 200, no 404 | ✅ PASS: 200 · `h1` "Contact" |
| 5 | `/guestbook` (fetch) | 200 | ✅ PASS: 200 |
| 6 | Unknown route `/does-not-exist` | 404 (sanity check) | ✅ PASS: 404 "Not found" (the only console error in this step comes from this probe) |
| 7 | Contact form: fill demo data → Send | success | ✅ PASS: `POST /api/contact` → **201** · status text "Sent. Thank you!" · form resets |
| 8 | `POST /api/contact` with invalid email | 400, short safe error | ✅ PASS: 400 `{"error":"Email is invalid"}` |
| 9 | `POST /api/contact` with `{}` | 400 | ✅ PASS: 400 `{"error":"Name is required"}` |
| 10 | `POST /api/contact` with malformed JSON | 400, no stack/SQL leak | ✅ PASS: 400 `{"error":"Invalid JSON body"}` |
| 11 | Guestbook form: fill demo data → Sign | 201 + entry appears in list | ✅ PASS: `POST` **201** → `GET` 200 · entry shows in `#entries` |
| 12 | `POST /api/guestbook` with empty name/message | 400 | ✅ PASS: 400 `{"error":"Name is required"}` |
| 13 | Guestbook markup probe (`<i data-e2e="probe">` in name, no script) | text is escaped | ❌ **FAIL**: API stores it raw, page renders it as a real element. See F1 |
| 14 | Screenshots | ≥ 2 pages | ✅ `docs/screenshots/home.png` · `contact-success.png` · `guestbook-entry.png` |

### Findings (not fixed this round)

| ID | Severity | Where | Details | Suggested owner |
|---|---|---|---|---|
| F1 | **High** (stored XSS) | `src/pages/guestbook.astro` (client `load()`) | `entries.innerHTML = ... ${e.name} ... ${e.message}` with no escaping, and the API stores raw HTML. Any visitor can inject markup/script that runs for everyone who opens the guestbook. Fix: build DOM with `textContent` (or escape `& < > " '`) on the frontend. Optional backend defense in depth | Claude `frontend` (UI) · OpenCode may add backend validation |
| F2 | Medium | `src/lib/profile.ts` `get()` | Regex `(?=^##\s|$)` with the `m` flag: `$` matches at the end of **every line**, so each section captures only its first line. Repro: Interests → `"- AI agents"` only. Multi-line Bio would be truncated too. Fix: change the lookahead to `(?=^##\s|(?![\s\S]))` (end of string) | Claude `frontend` (content parsing for the UI) |
| F3 | Medium (public-site-safe) | `docs/PROFILE.md` content | Home shows placeholder text "Replace this after Lab 01 interview." and a headline containing "multi-agent course". The course is visible to site visitors. `tests/public-site.test.ts` doesn't catch it because it only scans `src/` markup | Claude (PROFILE owner, Lab 01) |
| F4 | Low | `contact.astro`, `guestbook.astro` | `<title>` is just "Contact" / "Guestbook", while other pages use "X · Your Name" | Claude `frontend` |
| F5 | Low | repo root | `.playwright-mcp/` (MCP snapshots/logs) isn't in `.gitignore` | human / either |

**Note:** probe entry `Demo <i data-e2e="probe">…` + "markup probe" is left in local `data/site.sqlite` (not committed). Delete the file to reset.

## a11y Debate

> **Input:** E2E results above + `/contact` (measured with Playwright MCP `getComputedStyle`, WCAG 2.x luminance formula) + CSS in `src/layouts/BaseLayout.astro`
> **Measurement caveat:** during this session the Playwright MCP browser was being driven by another client (tabs closed on their own, the form showed "Sent. Thank you!" without our submit, Tab focus jumped to `astro-dev-toolbar`). So only the numbers and the single clean screenshot `docs/screenshots/contact-focus-input.png` are used as evidence. **Keyboard focus on the button/nav still needs manual verification.**

**Measurements from `/contact`**

| Check | Value | WCAG criterion | Result |
|---|---|---|---|
| Muted text (`--muted` #a5b4d4) on card (≈ #272c40) | 6.61:1 | 1.4.3 text ≥ 4.5 | ✅ |
| Label / h1 (`--text`) on card | > 15:1 | 1.4.3 | ✅ |
| Nav links (muted) on page bg | 7.73:1 | 1.4.3 | ✅ |
| Button text #081018 on `--accent` | 7.34:1 | 1.4.3 | ✅ |
| **Input border** (`--border` #243056) vs card | **1.07:1** | 1.4.11 non-text ≥ 3 | ❌ |
| **Input background** #0f1528 vs card (the only visible edge of the field) | **1.32:1** | 1.4.11 | ❌ |
| Input focus ring (browser default `outline: auto`) | thin white 1–2px, visible in screenshot | 2.4.7 | ⚠️ passes but weak and browser-dependent |
| Labels: `<label for>` matches `id` for all 3 fields | name/email/message | 1.3.1, 3.3.2 | ✅ |
| `autocomplete` on name/email | none | 1.3.5 | ❌ |
| Required indicator | only the HTML `required` attribute, no visible marker | 3.3.2 | ⚠️ |
| Error message | shown in `#status` (`role=status`, `aria-live=polite`), not tied to a field, no `aria-invalid` | 3.3.1 | ⚠️ |
| Heading order | `/contact`: H1 only · `/`: H1 → H2 ×4 | 1.3.1 | ✅ |
| Skip link / `main` id | none | 2.4.1 | ⚠️ (only 5 nav links) |
| `<html lang="th">` but main content is English | | 3.1.1 | ⚠️ |

### Advocate

- **The form fields are practically invisible.** The border is 1.07:1 against the card, far below the 3:1 in 1.4.11. The only thing separating a field from the card is its background (1.32:1). Low-vision users, or anyone on a dim screen, won't know where to click or type. This is the one real failing issue on the Contact page.
- **Focus relies on the browser default.** The input shows a thin white ring, which is okay in Chrome. But there's no `:focus-visible` style, so the button (`--accent` background) and the muted nav links look different from browser to browser. And we couldn't verify the button ring this round. The site should own its focus style; don't gamble on the UA.
- **Labels are correctly wired.** That's good. But `autocomplete="name"` / `"email"` is missing (1.3.5), and there's no visible marker for required fields.
- **Errors are announced through `role=status` (polite) but not tied to a field.** A screen reader hears "Error: Email is invalid" without knowing which field. Add `aria-invalid` + `aria-describedby`, or at least move focus to the bad field.
- **The page still has developer copy:** "ฟอร์มนี้โพสต์ไปที่ `POST /api/contact`". It doesn't help visitors, and it's noise for screen readers.
- **`lang="th"` while the content is English** makes screen readers pronounce the English in a Thai voice.
- **Guestbook (from E2E):** the form doesn't announce success or failure at all; a 400 is swallowed silently (`await fetch` without checking `res.ok`). And there's F1 XSS, which is both a safety and an accessibility problem, because injected markup can wreck the reading order.
- Colors/contrast of text are fine across the board; no need to touch the palette.

### Pragmatist

- **Must fix before ship (cheap, big payoff):**
  1. F1 XSS in the guestbook. This is a security issue that can't ship. The fix is one small function on the frontend.
  2. Input border to 3:1 plus an explicit `:focus-visible`: 2–3 lines of CSS in one place (`BaseLayout.astro`), affecting every form on the site at once.
  3. Remove the `POST /api/contact` copy and add `autocomplete`: a few attributes, zero risk.
- **Fine after ship:** field-level `aria-invalid`/`aria-describedby` (needs restructuring the client script), skip link (only 5 links), reconsidering `lang` (needs a decision on whether the site is Thai or English, which is a content call for the PROFILE owner, not a CSS fix).
- **Don't do:** redesigning the palette. Text contrast already passes everywhere. Changing `--border` globally also changes card and nav borders, which are decorative and don't need 3:1. Scope it to inputs only.
- **Order of work:** F1 → CSS field/focus → contact copy/autocomplete → guestbook status. Everything is in the frontend (Claude `frontend`); nothing touches `db.ts`/API, so no cross-ownership.
- **Verify by:** rerunning the E2E steps in the table above plus measuring the border contrast again (target ≥ 3:1). Test keyboard focus by hand in a browser that isn't shared with another agent.

**Where they agree:** the palette stays; fix contrast for fields only; focus must be explicit; F1 before everything. **Open:** `lang` (th vs en) → content decision for the owner.

## a11y Action items (prioritized P0/P1/P2)

| Pri | ID | Action | Where | WCAG / source | Effort | Done when |
|---|---|---|---|---|---|---|
| **P0** | A1 | Render guestbook entries with `textContent` / DOM nodes instead of `innerHTML` template | `src/pages/guestbook.astro` | E2E F1 (security) | ~15 min | markup probe shows as plain text, no `<i>` element in `#entries` |
| **P0** | A2 | Input/textarea border → `#6b7bab` (3.32:1 vs card, 4.36:1 vs field bg), inputs only | `src/layouts/BaseLayout.astro` | 1.4.11 | ~5 min | measured again ≥ 3:1 |
| **P0** | A3 | Explicit `:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px }` (accent vs card 5.3:1, vs page 7.26:1) | `src/layouts/BaseLayout.astro` | 2.4.7 / 1.4.11 | ~5 min | Tab through nav → fields → Send shows a clear ring on every element (verified manually) |
| **P1** | A4 | Replace the "POST /api/contact" copy with a visitor-facing sentence + add `autocomplete="name"` / `"email"` | `src/pages/contact.astro` | 1.3.5 | ~10 min | no API path in markup · autocomplete attributes present |
| **P1** | A5 | Guestbook: check `res.ok`, show success/error in a `role="status"` element | `src/pages/guestbook.astro` | 4.1.3 | ~15 min | a 400 shows "Name is required" to the user |
| **P1** | A6 | Remove "multi-agent course" from the default `description` in `BaseLayout` (renders into `<meta>` but `public-site.test.ts` misses it because the value is in frontmatter) | `src/layouts/BaseLayout.astro` | public-site-safe | ~2 min | no "course" in rendered HTML |
| P2 | A7 | Field-level errors: `aria-invalid` + `aria-describedby` + focus the bad field | `contact.astro`, `guestbook.astro` | 3.3.1 | ~30–45 min | screen reader reads error with field name |
| P2 | A8 | Visible required marker (e.g. "(required)" in the label) | forms | 3.3.2 | ~10 min | |
| P2 | A9 | Skip link "Skip to content" + `<main id="main">` | `BaseLayout.astro` | 2.4.1 | ~10 min | |
| P2 | A10 | Decide `lang` (th / en) to match the real content | `BaseLayout.astro` + PROFILE | 3.1.1 | content decision | owner decides |

P0 A1–A3 + P1 A4 add up to about 35 min in total; all are frontend (Claude `frontend`), none touch API/SQLite.

### Progress

| ID | Status | Evidence |
|---|---|---|
| A2 | ✅ Done (2026-09-25) | `BaseLayout.astro`: `input, textarea { border-color: #6b7bab; }` → measured again: border vs card **3.31:1**, vs field **4.36:1** (was 1.07 / 1.41) · button/card borders unchanged (`#243056`) |
| A3 | ✅ Done (2026-09-25) | `:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }` → the Send button shows a solid accent ring at 2px offset (`docs/screenshots/contact-focus-after.png`) · a full manual Tab walkthrough of the nav is still pending (shared browser issue, see caveat above) |
| A1 | ✅ Done (2026-09-25) | `guestbook.astro` `load()` builds DOM with `textContent`/text nodes instead of `innerHTML` → the probe entry now shows as literal text `Demo <i data-e2e="probe">probe</i>`, `#entries i[data-e2e="probe"]` = none, demo entry still displays (`docs/screenshots/guestbook-escaped.png`). E2E step 13 / F1: **FAIL → PASS** (frontend). Raw HTML is still stored in the API; backend validation is optional defense in depth (OpenCode) |
| A4 | ✅ Done (2026-09-25) | `contact.astro`: API path copy replaced with visitor copy · `autocomplete="name"` / `"email"` (guestbook name too) |
| A5 | ✅ Done (2026-09-25) | `guestbook.astro`: `#gb-status` (`role=status`) checks `res.ok` → whitespace name shows "Error: Name is required", success shows "Thanks for signing!" (Playwright) · dropped `aria-live` from `#entries` so screen readers don't re-read the whole list on every load · removed the `/api/guestbook` copy |
| A6 | ✅ Done (2026-09-25) | default `description` in `BaseLayout` = "Personal branding site" · curl every page: `course` / `lab 0` / `/api/` = 0 |
| F2 | ✅ Done (2026-09-25) | `profile.ts`: split out `parseProfile()` + lookahead `(?=^##\s|(?![\s\S]))` · new `tests/profile.test.ts` (RED → GREEN) · `/api/interests` returns all 3 items · About splits Bio into paragraphs, Home shows the first paragraph |
| F3 | ✅ Resolved by content | `docs/PROFILE.md` has real content now (edited outside this session, not committed by Claude) |
| F4 | ✅ Done (2026-09-25) | titles "Contact · name" / "Guestbook · name" |
| F5 | ✅ Done (2026-09-25) | `.playwright-mcp/` in `.gitignore` |
| A10 | ✅ Resolved | content is Thai now → `lang="th"` is correct |
| A7 | ✅ Done (2026-09-25) | new `src/lib/form-errors.ts` (`fieldForError` + `tests/form-errors.test.ts` RED → GREEN) · both forms: every field has `aria-describedby` → `#<id>-error` · on a 400 the matching field gets `aria-invalid="true"`, the error text shows under it, and focus moves there; next submit clears it (Playwright: contact `name` "Name is required" → `email` "Email is invalid", guestbook `message` "Message is required") · errors not tied to a field still go to `role=status` |
| A8 | ✅ Done (2026-09-25) | every label shows "(required)" (`aria-hidden`, because the `required` attribute is already announced) · contact 3 / guestbook 2 |
| A9 | ✅ Done (2026-09-25) | `BaseLayout`: "Skip to content" is the first focusable element (hidden until focused) → `<main id="main" tabindex="-1">` · Playwright: first Tab focuses the skip link, Enter → focus on `main` |
| — | `npm test` / `npm run build` | 9 passed (4 files) · build Complete · every page 200 · `course` / `lab 0` / `/api/` in markup = 0 |

| L5 | ✅ Done (2026-09-25) | Playwright real keyboard `Tab` on `/contact` and `/guestbook` from the top of the page: Skip to content → Home → About → Interests → Contact → Guestbook → fields → Send/Sign. Every stop is `:focus-visible` with a solid accent outline; no `astro-dev-toolbar` stop this time |

**Still open:** none for Lab 06 · optional L6 (backend HTML validation, OpenCode)

