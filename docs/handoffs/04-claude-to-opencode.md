# Handoff: Claude `frontend` → OpenCode `backend`

Timestamp: 2026-09-25 14:25 +07:00  
Task: Lab 04 UI เสร็จ → Lab 05 API + SQLite  
Status: IMPLEMENTED (ยังไม่ commit — ผู้เรียนต้อง commit ก่อน OpenCode แตะ working tree)

## What changed

- Parser `src/lib/profile.ts` (D1): Bio ได้ครบทุกย่อหน้า · Interests ครบ 3 ข้อ · มี field ใหม่ `tagline` / `principle` · export `FALLBACK`, `parseProfile`, `paragraphs`
- **ผลต่อ `GET /api/interests`**: ตอนนี้คืน interests ครบทุกข้อจาก PROFILE (เดิมได้ข้อเดียว) — shape `{ interests, source }` เหมือนเดิม ไม่ได้แตะไฟล์ API
- หน้า UI: Home · About (Bio + Interests) · Playbook · Contact · Guestbook · ลบ `/interests` (404 ตั้งใจ ตาม D8)
- Contact: payload เดิม `{ name, email, message }` (JSON) · ปิดฟอร์มด้วยสวิตช์ `src/lib/features.ts` `CONTACT_FORM_OPEN = false` (D10) — UI ไม่ POST เลยตอนปิด
- UI แปลง status → ข้อความไทยเอง ไม่แสดง `error` ดิบ: 201 = สำเร็จ · 400 = ข้อมูลไม่ถูกต้อง · 501 = ยังไม่เปิด · อื่น ๆ = ส่งไม่สำเร็จ
- Guestbook: form disabled จนกว่า `GET /api/guestbook` ตอบ 200 `{ entries: [{ name, message, created_at }] }` · 501 → "ยังไม่เปิด" · render ด้วย textContent

## Files

- `src/layouts/BaseLayout.astro` · `src/pages/{index,about,playbook,contact,guestbook}.astro` · `src/lib/features.ts` · `src/lib/profile.ts`
- `tests/profile.test.ts` · `tests/render.test.ts` · `tests/public-site.test.ts` · `playwright/smoke.spec.ts`

## Verification

- Unit / smoke: PASS — `npm test` 4 files / 27 tests
- Labs (`npm run test:labs`): FAIL (คาดไว้) — 2/2 fail ด้วย `NOT_IMPLEMENTED` จาก `src/lib/db.ts`
- Manual / localhost: `npm run build` + `node dist/server/entry.mjs` → `/` `/about` `/playbook` `/contact` `/guestbook` = 200 · `/interests` = 404 · `/api/guestbook` = 501

## Assumptions to challenge

1. UI คาดว่า 400 = validation error ที่ผู้ใช้แก้ได้ · 500 = server error — ถ้า backend ใช้ code อื่น (เช่น 422) UI จะโชว์ "ส่งไม่สำเร็จ" แทน "ข้อมูลไม่ถูกต้อง"
2. `listGuestbook` ที่คืนข้อมูลทันทีจะแสดงบนหน้าเลยโดยไม่มี moderation — DECISIONS ระบุว่า Guestbook ต้องมี moderation + rate limit ก่อนแสดง (Out of scope v1) · เสนอ: ให้ list คืนเฉพาะแถวที่อนุมัติแล้ว หรือคง 501 ของ GET ไว้จนมี moderation
3. `created_at` แสดงเป็น string ดิบ — ถ้าเปลี่ยนรูปแบบ แจ้ง frontend

## Request to next agent

**Lab 05 (OpenCode `backend`) — implement API เท่านั้น อย่าแตะ UI (`src/pages/*.astro`, `src/layouts/`, `src/lib/features.ts`, `src/lib/profile.ts`)**

1. Implement `insertContact` / `insertGuestbook` / `listGuestbook` ใน `src/lib/db.ts` ให้ `tests/labs/lab05-api.test.ts` เขียว (`npm run test:labs`) โดย `npm test` ยังเขียว
2. Validate ความยาว/รูปแบบพื้นฐาน (UI จำกัด: name ≤ 80 · email ≤ 120 · contact message ≤ 2000 · guestbook message ≤ 500) · error message ปลอดภัย ไม่มี SQL/stack trace (route ส่ง `err.message` ออกไปตรง ๆ — ควรแยก validation error กับ error อื่น)
3. D11: ออกแบบกลไกลบข้อมูล contact + ระยะเก็บ — UI จะประกาศบนเว็บได้ก็ต่อเมื่อลบได้จริง · บันทึกผลใน handoff กลับ
4. รับทราบ: parser เปลี่ยนผล `/api/interests` (ข้อบน) — ตรวจว่าไม่มีอะไรฝั่ง API พึ่ง output เดิม
5. Later (ไม่ทำรอบนี้): ช่องประเภท "ถามคำถาม/เสนอหัวข้อ" ในฟอร์ม = เปลี่ยน payload ต้อง handoff ก่อน
6. จบงาน: เขียน `docs/handoffs/05-opencode-to-claude.md` แจ้งว่า lab05-api เขียว → Claude `frontend` พลิก `CONTACT_FORM_OPEN` (L6)

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md` (L5 → OpenCode · L6 · L8 · L9)
- [ ] `docs/DECISIONS.md` (ไม่มี decision ใหม่ · L8 รอเจ้าของตัดสิน)
- [ ] อื่น ๆ: —

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = OpenCode `backend` (หลังผู้เรียน commit งาน Lab 04)
