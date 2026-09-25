# Project Status

> คัดลอกเป็น `docs/STATUS.md` ใน Lab 00 · อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 14:25 +07:00  
Updated by: Claude `frontend`

## Current goal

- Lab 04 UI เสร็จบน branch `lab-04-frontend` (ยังไม่ commit / ยังไม่เปิด PR) → ส่งต่อ OpenCode ทำ Lab 05 (API + SQLite)

## Done

- Lab 01–02: PROFILE · DEBATE · DECISIONS D1–D16 · Lab 03: issues #1–#5
- D1 (L2): parser `src/lib/profile.ts` แบบ section-split + `tagline`/`principle` + FALLBACK · `tests/profile.test.ts`
- Lab 04 UI: Home Hero (D3/D5) · About = Bio เต็ม + Interests `#interests` (D8) · `playbook.astro` 5 ขั้น + checklist คนตรวจ (D7) · Contact (D9–D11) · ลบ `interests.astro` (D8) · ธีมสว่าง/มืด (D13) · a11y ขั้นต่ำ (D14)
- สวิตช์ D10 = `src/lib/features.ts` `CONTACT_FORM_OPEN = false`
- Guestbook: เริ่ม disabled · 501 → "ยังไม่เปิด" · render ด้วย textContent (ไม่มี innerHTML)
- D15: guard regex จับ course/คอร์ส/workshop/เวิร์กช็อป · `tests/render.test.ts` render จริง 5 หน้า (container API) · meta description ไม่มี "course" แล้ว
- `npm test` 4 files / 27 tests PASS · `npm run build` PASS · built server: `/` `/about` `/playbook` `/contact` `/guestbook` = 200, `/api/guestbook` = 501

## In progress

- —

## Blocked

- —

## Next actions

1. ผู้เรียน: ตรวจหน้า `npm run dev` + screenshot → commit → เปิด PR เข้า learner repo (Lab 04)
2. OpenCode: Lab 05 ตาม `docs/handoffs/04-claude-to-opencode.md`
3. หลัง lab05-api เขียว: พลิก `CONTACT_FORM_OPEN` (L6)
4. เจ้าของตอบ L4 (สถานะ Playbook จริง · NDA · GitHub handle) · ตัดสินว่าจะเก็บลิงก์ Guestbook ในเมนูหรือไม่ (L8)

## Files changed in latest session

- `src/layouts/BaseLayout.astro` · `src/pages/{index,about,contact,guestbook,playbook}.astro` · ลบ `src/pages/interests.astro`
- `src/lib/features.ts` (ใหม่) · `tests/render.test.ts` (ใหม่) · `tests/public-site.test.ts` · `playwright/smoke.spec.ts` (ป้ายไทย)
- `docs/STATUS.md` · `docs/OPEN_LOOPS.md` · `docs/handoffs/04-claude-to-opencode.md`

## Notes

- Playbook: ทุกขั้นป้าย "กำลังทดลอง" จนเจ้าของยืนยัน (L4) — ห้ามเปลี่ยนเป็น "ทำแล้ว" เอง
- `/interests` ตอนนี้ 404 (ตั้งใจตาม D8) · `/api/interests` ไม่ได้แตะ
