# Project Status

> คัดลอกเป็น `docs/STATUS.md` ใน Lab 00 · อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 15:39 +07:00  
Updated by: OpenCode

## Current goal

- Lab 05 — guestbook/contact persistence (better-sqlite3) จน `npm run test:labs` เขียว

## Done

- `src/lib/db.ts`: implement `getDb` (per-DATA_DIR cache, WAL), `insertContact`, `insertGuestbook`, `listGuestbook` + `ValidationError` (validation input, error ไม่ leak stack/SQL)
- `npm run test:labs` เขียว: `tests/labs/lab05-api.test.ts` 2 passed (insertContact + guestbook roundtrip)
- `npm test` เขียว: 3 passed (public-site + smoke) — ไม่พังชุด CI

## In progress

- —

## Blocked

- —

## Next actions

1. Commit `src/lib/db.ts` + docs นี้ → เปิด PR ไป learner repo (ข้อความ PR อยู่ใน handoff/PR description — ownership Backend = OpenCode)
2. Handoff กลับ Claude frontend ต่องาน UI (ผ่าน `docs/handoffs/TEMPLATE.md`) หรือ resume session นี้เพื่อต่อ Lab 05b

## Files changed in latest session

- `src/lib/db.ts`
- `docs/STATUS.md`
- `docs/OPEN_LOOPS.md`

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- API routes (`src/pages/api/{contact,guestbook}.ts`) เดิมเรียก helper ครบแล้ว — แก้เฉพาะ `db.ts` ตาม ownership
