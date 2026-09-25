# API Notes — contact / guestbook

> Backend = OpenCode · อ่านประกอบการผูกฟอร์ม (UI = Claude `frontend`) · contract ตามที่ implement จริง

## POST /api/contact

- Body JSON: `{ name, email, message }` — string ทั้งหมด · name ≤ 100 · email ≤ 254 (รูปแบบ `x@y.z`) · message ≤ 2000
- `201` → row `{ id, name, email, message, created_at }` (ISO string)
- `400` → `{ error }` — Invalid JSON body / ข้อความ validate ที่ปลอดภัย (จาก `ValidationError`)
- `500` → `{ error: "Failed to save contact message" }` — ไม่มี stack/SQL

## POST /api/guestbook

- Body JSON: `{ name, message }` — name ≤ 100 · message ≤ 2000
- `201` → row `{ id, name, message, created_at }`
- `400` / `500` ตรงตาม contact

## GET /api/guestbook

- `200` → `{ entries: GuestbookEntry[] }` — ใหม่สุดก่อน · capped 200

## GET /api/interests

- `200` → `{ interests: string[], source: "profile" }` — จาก `docs/PROFILE.md`

## เงื่อนไขฝั่ง client

- ทุก response error เป็น JSON `{ error }` — ไม่ leak stack · แสดงข้อความที่ผู้ใช้อ่านได้
- Storage: `$DATA_DIR/site.sqlite` (better-sqlite3) — table `contact_messages` / `guestbook`
- Test: `npm run test:labs` (labs) · `npm test` (unit · ไม่รวม labs)
