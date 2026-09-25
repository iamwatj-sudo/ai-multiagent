# Project Status

> คัดลอกเป็น `docs/STATUS.md` ใน Lab 00 · อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 16:50 +07:00  
Updated by: Claude

## Current goal

- Lab 06 — E2E (Playwright MCP) + a11y · แก้ P0/P1 ฝั่ง frontend ก่อน ship

## Done

- Lab 05 (OpenCode): `src/lib/db.ts` persistence — `test:labs` เขียว (commit `30e1419`)
- Lab 06 (Claude): E2E 14 steps + a11y debate + action items ใน `docs/QA.md` · screenshots ใน `docs/screenshots/`
- แก้แล้ว: guestbook XSS (A1) · field border 3.31:1 + `:focus-visible` (A2/A3) · contact copy + autocomplete (A4) · guestbook status (A5) · meta description (A6) · `parseProfile` ตัดบรรทัด (F2 + `tests/profile.test.ts`) · titles (F4) · `.gitignore` `.playwright-mcp/` (F5)
- a11y P2 (Claude): A7 field-level errors (`src/lib/form-errors.ts`) · A8 required marker · A9 skip link — verified with Playwright
- `.gitignore`: `opencode.json` + `opencode.json.*` (local config/backup ที่อาจมี secret)
- `docs/PROFILE.md` เนื้อหาจริง commit แล้ว (`8f3454b`) · Tab walkthrough ผ่านทั้ง `/contact` และ `/guestbook`
- `npm test` 9 passed · `npm run build` ผ่าน

## In progress

- —

## Blocked

- —

## Next actions

1. Lab 07 (review) / ship
2. (ทางเลือก) OpenCode: validate/strip HTML ใน guestbook API เป็น defense in depth

## Files changed in latest session

- `src/layouts/BaseLayout.astro` · `src/pages/{contact,guestbook}.astro` · `src/lib/form-errors.ts` (ใหม่)
- `tests/form-errors.test.ts` (ใหม่) · `.gitignore`
- `docs/QA.md` · `docs/STATUS.md` · `docs/OPEN_LOOPS.md`

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- Playwright MCP browser ถูก client อื่นใช้พร้อมกันระหว่างเซสชันนี้ (แท็บปิดเอง / ฟอร์มถูกส่งเอง) — อย่าใช้ MCP browser ตัวเดียวกันสองฝั่งพร้อมกัน
- `/api/contact` ไม่ได้แก้ในรอบนี้ (ownership OpenCode) — แก้เฉพาะ UI + `profile.ts`
