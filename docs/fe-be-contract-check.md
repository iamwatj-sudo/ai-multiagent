# ตรวจสัญญา Frontend ↔ Backend: ฟอร์ม Contact / Guestbook

> โดย OpenCode `backend` · 2026-09-25 · อ้างอิง `docs/DECISIONS.md` (D9–D11) · `docs/handoffs/04-claude-to-opencode.md`
> ขอบเขต: อ่านอย่างเดียว — **ไม่แตะ `src/` ทุกไฟล์** · รายงานฉบับนี้เป็น input ของ Lab 05 (OPEN_LOOPS L5)

## สรุป 1 บรรทัด

สัญญา payload + status codes ตรงกันเกือบทั้งหมด — จุดเสี่ยงอยู่ที่ **(1) validation ที่ยังไม่มีใครรับผิดชอบจริง, (2) การ map error จาก `err.message` ที่เปราะและ leak ข้อความดิบ, (3) Guestbook แสดงผลทันทีโดยไม่มี moderation ขัด DECISIONS**

---

## 1. Contact — `POST /api/contact`

### สิ่งที่ฝั่งฟอร์ม (`src/pages/contact.astro`) ส่ง/คาดหวัง

| รายการ | ค่า |
|---|---|
| Method / Content-Type | `POST` · `application/json` |
| Payload | `{ name, email, message }` จาก `FormData` (JSON.stringify) |
| ข้อจำกัดฝั่ง UI | `name` ≤ 80 (required) · `email` ≤ 120 (type=email, required) · `message` ≤ 2000 (required) |
| Interpretação status | `res.ok` (2xx) = สำเร็จ · `400` = "ข้อมูลไม่ถูกต้อง" · `501` = "ยังไม่เปิดรับ" · อื่น ๆ = "ส่งไม่สำเร็จ" · network error = ข้อความแยกต่างหาก |
| การปิดฟอร์ม (D10) | สวิตช์ `CONTACT_FORM_OPEN = false` ใน `src/lib/features.ts` → ไม่ POST เลย + fieldset disabled + fallback: เจอ 501 จะ disable ซ้ำ |
| การแสดง error (D9) | ไม่แสดง `error` ดิบจาก response body เด็ดขาด — map เป็นข้อความไทยเท่านั้น |

### สิ่งที่ฝั่ง API (`src/pages/api/contact.ts` + `src/lib/db.ts`) ทำตอนนี้

- Parse `request.json()` → ส่ง `body` ทั้งก้อนเข้า `insertContact(body)` → stub โยน `NOT_IMPLEMENTED: insertContact` → route map เป็น **501**
- Error อื่น ๆ (รวม `request.json()` parse fail) → **400 พร้อม `err.message` ดิบ** ใน body

### ผลการเทียบ

| # | ประเด็น | สถานะ |
|---|---|---|
| C1 | Payload `{name, email, message}` ตรงกันทั้งชื่อ key และ type | ✅ ตรงกัน |
| C2 | 201 = สำเร็จ (FE รับ `res.ok` ทั้ง 2xx) | ✅ ตรงกัน |
| C3 | 501 = ยังไม่เปิด (stub โยน `NOT_IMPLEMENTED` → 501) | ✅ ตรงกัน |
| C4 | 400 = validation error ที่ผู้ใช้แก้ได้ | ⚠️ ตรงกันบนกระดาษ — ดู mismatch M1–M2 |
| C5 | ข้อจำกัดความยาว 80/120/2000 | ⚠️ FE จำกัดฝั่ง UI แล้ว แต่ BE ยังไม่ validate (ดู M1) |
| C6 | ไม่แสดง error ดิบ (D9) | ⚠️ FE ไม่แสดง แต่ response body ยังส่ง `err.message` ดิบออกไป (ดู M2) |

### Mismatch / ความเสี่ยง

- **M1 — ไม่มีชั้น validation ชัดเจน:** stub รับ `body` ทั้งก้อน (`any`) ไม่ตรวจ type/ความยาว/email format/field ขาด และ route เองไม่ตรวจก่อนเรียก `insertContact` เมื่อ Lab 05 implement แล้ว ถ้า validation อยู่ลึกใน `db.ts` และโยน error แบบกำหนดไม่ดี FE จะโชว์ "ข้อมูลไม่ถูกต้อง" ก็ต่อเมื่อ route map เป็น 400 ได้ถูก — สัญญา "400 = แก้ได้โดยผู้ใช้" ยังไม่มีเจ้าของที่ชัดเจน
- **M2 — leak ข้อความ error ดิบ:** route คืน `JSON.stringify({ error: message })` โดย `message` มาจาก `err.message` ตรง ๆ ทั้งกรณี 400 และ 500 — แม้ FE ไม่แสดง (D9 ผ่านบนหน้าจอ) แต่ใครกด `curl` ก็เห็น stack-ish message · กรณี `request.json()` parse ล้มเหลวข้อความ parser ของ Node ก็หลุดออกไปด้วย
- **M3 — การจับ 501 พึ่ง string prefix:** `message.startsWith('NOT_IMPLEMENTED')` เป็นสัญญาที่เปราะ — ถ้า Lab 05 แก้ข้อความใน `db.ts` แม้เล็กน้อย 400/501 จะพังทันทีและ FE จะโชว์ "ส่งไม่สำเร็จ" แทน "ยังไม่เปิด"
- **M4 — response 201 echo ข้อมูลกลับทั้ง row รวม `email`:** FE ไม่อ่าน body เลย การส่ง PII กลับไปไม่จำเป็น (PDPA-minded ตาม D11)
- **M5 — BE ยังไม่ตรวจ method/header:** ไม่มีปัญหาจริง (Astro เรียก POST handler เมื่อ POST) แต่ควรตกลงว่า body ที่ไม่ใช่ JSON = 400 ไม่ใช่ 500

### ข้อเสนอ (ฝั่ง BE ทำใน Lab 05 — ไม่แตะ FE)

1. Validate ใน route หรือ helper ก่อน `insertContact`: `name` string trim 1–80 · `email` string 1–120 ผ่าน regex ง่าย ๆ · `message` string 1–2000 · ไม่ผ่าน = คืน 400 ด้วย body `{ error: 'validation' }` (code คงที่ ไม่ใช่ err.message)
2. เปลี่ยนการจับ 501 จาก string prefix → throw error ที่มี property เช่น `err.code = 'NOT_IMPLEMENTED'` หรือให้ stub คืน sentinel ตรวจได้ (ต้องแก้พร้อมกันที่ route + db.ts — ทั้งคู่เป็น ownership OpenCode อยู่แล้ว)
3. คืน 201 เป็น `{ ok: true, id: row.id }` — ไม่ echo `email` กลับ
4. กรณี server error คืน 500 + `{ error: 'internal' }` — log เต็มไว้ server-side ไม่ส่ง message ออกไป

---

## 2. Guestbook — `GET` / `POST /api/guestbook`

### สิ่งที่ฝั่งฟอร์ม (`src/pages/guestbook.astro`) ส่ง/คาดหวัง

| รายการ | ค่า |
|---|---|
| GET | คาดหวัง `200 { entries: [{ name, message, created_at? }] }` → เปิดฟอร์ม (ปลด disabled) + render รายการ · `501` = "ยังไม่เปิด" · error อื่น/เน็ตล้ม = "โหลดไม่สำเร็จ" |
| POST | payload `{ name, message }` (ไม่มี email) · คาดหวัง 2xx แล้ว `reset()` + โหลดซ้ำ + "ขอบคุณ" · 400 = invalid · 501 = closed |
| การ render | `textContent` ทั้งหมด — ไม่มี `innerHTML` (ตรงเงื่อนไข DECISIONS) |
| ข้อจำกัฝั่ง UI | `name` ≤ 80 · `message` ≤ 500 |

### สิ่งที่ฝั่ง API ทำตอนนี้

- GET: `listGuestbook()` stub → 501 · เมื่อ implement จะคืน `200 { entries: rows }` ตรง shape
- POST: `insertGuestbook(body)` stub → 501 · เมื่อ implement คืน 201 พร้อม row เต็ม

### ผลการเทียบ

| # | ประเด็น | สถานะ |
|---|---|---|
| G1 | GET shape `{ entries }` + field `name/message/created_at` | ✅ ตรงกัน (`GuestbookEntry` ใน db.ts มี field พอดี) |
| G2 | POST payload `{name, message}` ไม่มี email | ✅ ตรงกัน type `GuestbookEntry` ไม่มี email |
| G3 | 501 → "ยังไม่เปิด" ทั้ง GET/POST | ✅ ตรงกัน (กลไกเดียวกับ M3 — เสี่ยง prefix เหมือนกัน) |
| G4 | POST สำเร็จ → FE เรียก GET ซ้ำแล้วแสดงข้อความใหม่ทันที | ❌ ขัด DECISIONS (ดู M6) |
| G5 | 400 = invalid mapping | ⚠️ เหมือน Contact — ยังไม่มีชั้น validate |
| G6 | `created_at` แสดง string ดิบ | ⚠️ ตกลง format ให้ชัด (handoff ข้อ 3 แจ้งไว้แล้ว) |

### Mismatch / ความเสี่ยง

- **M6 — แสดงผลทันทีไม่มี moderation (สำคัญสุด):** DECISIONS กำหนด Guestbook = Out of scope v1 จนกว่าจะมี moderation ก่อนแสดง + rate limit — แต่สัญญาปัจจุบัน (FE + lab test + stub) มุ่งให้ `listGuestbook()` คืนข้อมูลและหน้าเว็บ render ทันทีที่ POST สำเร็จ ถ้า Lab 05 implement ตาม test ตรง ๆ จะเปิด spam ทันทีที่ GET ตอบ 200 (FE เปิดฟอร์มโดยอัตโนมัติเมื่อเห็น 200)
- **M7 — ไม่มี rate limit:** POST เรียกซ้ำได้ไม่จำกัด ขัดเงื่อนไข moderation ใน DECISIONS
- **M8 — moderation state ไม่มีใน schema:** ตาราง `guestbook` ไม่มีคอลัมน์สถานะ (เช่น `approved`) ทำให้ "list เฉพาะที่อนุมัติ" ทำไม่ได้โดยไม่แก้ schema
- **M9 — 201 echo row เต็ม:** เหมือน M4 — FE ไม่อ่าน ไม่จำเป็นต้องส่งกลับ

### ข้อเสนอ

1. **ทางที่สอดคล้อง DECISIONS ที่สุด:** Lab 05 ให้ `insertGuestbook` เขียนลง DB จริง แต่ให้ `listGuestbook()` คืน**เฉพาะแถวที่ `approved = 1`** (เริ่มต้น approved = 0 → GET ตอบ `200 { entries: [] }` ฟอร์มจะเปิด แต่ไม่มีอะไรแสดงจนมี moderation) **หรือ** คง 501 ที่ GET ไว้จนกว่า moderation พร้อม — แล้วบันทึกทางเลือกที่เลือกลง handoff กลับ (`05-opencode-to-claude.md`)
2. เพิ่มคอลัมน์ `approved INTEGER NOT NULL DEFAULT 0` ตอนสร้างตาราง (ยังไม่มีข้อมูลจริง แก้ schema ตอนนี้ฟรี)
3. Rate limit ขั้นต่ำ: จำกัดต่อ IP แบบ in-memory (เช่น 5 ครั้ง/10 นาที) พอสำหรับ v1 — พอเกินคืน 429 (FE จะโชว์ "ส่งไม่สำเร็จ" ซึ่งรับได้ หรือแจ้ง FE เพิ่มทีหลัง)
4. Validate: `name` 1–80 · `message` 1–500 · ตัด/ปฏิเสธ whitespace ล้วน

---

## 3. หมายเหตุเกี่ยวข้อง (ยืนยันจากการอ่าน ไม่มีงานเพิ่ม)

- **`GET /api/interests`** ไม่เกี่ยวกับฟอร์ม — parser ใหม่ทำให้ `interests` ครบขึ้น แต่ shape `{ interests, source }` เดิม · หน้า `/interests` ถูกลบตาม D8 แล้ว API นี้ไม่มีผู้เรียกภายในเว็บ — แตะไม่ได้ก็ได้ แต่ถ้าจะลบต้องเช็คว่าไม่มี link ชี้มา
- **สวิตช์ D10:** `CONTACT_FORM_OPEN = false` ยังปิดอยู่ถูกต้อง — เปิดได้เฉพาะหลัง `tests/labs/lab05-api.test.ts` เขียว (L6 · owner Claude `frontend` — ไม่ใช่งาน OpenCode)
- **D11:** กลไกลบข้อมูล contact ยังเป็นหน้าที่ Lab 05 (L5 ข้อ 3) — UI จะประกาศระยะเก็บได้ก็ต่อเมื่อลบได้จริง

## สรุปสั้นสำหรับ handoff กลับ

| ต้องทำใน Lab 05 | ทำไม่ได้/ยังไม่ทำ |
|---|---|
| ชั้น validate ที่ route และ error code คงที่ (`{ error: 'validation' }` ฯลฯ) ไม่ส่ง `err.message` ดิบ (M1, M2) | แก้ `contact.astro` / `guestbook.astro` / `features.ts` — เป็นของ Claude `frontend` |
| เลิกจับ 501 ด้วย `startsWith('NOT_IMPLEMENTED')` (M3) | ประกาศระยะเก็บข้อมูลบนเว็บ — รอ D11 กลไกลบจริง |
| ตัดสิน Guestbook: approved column + moderation หรือคง 501 (M6–M8) | ช่องประเภท "ถาม/เสนอหัวข้อ" — Later ตาม DECISIONS ต้อง handoff ก่อน |
| Rate limit ขั้นต่ำ Guestbook (M7) | |

*ไฟล์นี้เป็นรายงานการตรวจสัญญา — ไม่เปลี่ยน canonical state ของ STATUS/OPEN_LOOPS (single-writer รอบถัดไปรอผู้เรียน commit Lab 04 ก่อน ตาม handoff 04)*