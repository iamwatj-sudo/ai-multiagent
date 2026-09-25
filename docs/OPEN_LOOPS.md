# Open Loops

> คัดลอกเป็น `docs/OPEN_LOOPS.md` ใน Lab 00 · งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ  
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 14:25 +07:00

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L4 | ตอบคำถามก่อน ship: NDA checklist · Playbook เดินครบจริงกี่ขั้น (ป้ายสถานะ D7) · GitHub handle จริง | human | P2 | ก่อน ship | D7, D16 · ตอนนี้ทุกขั้นป้าย "กำลังทดลอง" ใน `playbook.astro` |
| L5 | Lab 05 backend ตาม `docs/handoffs/04-claude-to-opencode.md`: implement `insertContact` / `insertGuestbook` / `listGuestbook` · รับรู้ผล parser ต่อ `api/interests.ts` · กลไกลบข้อมูล (D11) | OpenCode `backend` | P1 | Lab 05 | handoff เขียนแล้ว 2026-09-25 |
| L6 | พลิก `CONTACT_FORM_OPEN` ใน `src/lib/features.ts` เป็น `true` เมื่อ `tests/labs/lab05-api.test.ts` เขียว · อัปเดตเทสต์ contact ใน `tests/render.test.ts` ตาม | Claude `frontend` | P1 | หลัง Lab 05 | D10 · สวิตช์ตัวเดียวคุม แถบแจ้ง/ฟอร์ม disabled/CTA "ถามผม" |
| L7 | จำนวนปีประสบการณ์จริง (ถ้าต้องการใส่ใน Bio) · ตัดสิน audience รอง (tech lead) | human | P3 | ก่อน ship | D12 · Out of scope ใน DECISIONS |
| L8 | ลิงก์ "สมุดเยี่ยม" ในเมนู ขัดกับ DECISIONS (Guestbook = Out of scope v1 · D8 เมนู = Playbook/About/Contact) — ใส่ตามคำขอรอบ Lab 04 · เจ้าของตัดสิน: เก็บ / ซ่อน / บันทึก decision ใหม่ | human | P2 | ก่อน merge PR Lab 04 | ถ้าเก็บ ต้องมี moderation + rate limit ก่อนแสดงข้อความ (OpenCode) |
| L9 | Commit + เปิด PR Lab 04 เข้า learner repo (แนบ screenshot) · commit ก่อนสลับ harness | human | P1 | ก่อนเริ่ม Lab 05 | PR body draft อยู่ในรายงานรอบนี้ |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-25 |
| L2 | D1 parser `profile.ts` + `tagline`/`principle` + เทสต์ | 2026-09-25 |
| L3 | ย้าย Interests เข้า About · ลบ `interests.astro` + ลิงก์ (D8) | 2026-09-25 |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
