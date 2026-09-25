# Open Loops

> คัดลอกเป็น `docs/OPEN_LOOPS.md` ใน Lab 00 · งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ  
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 16:40 +07:00

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L3 | Commit เนื้อหาใหม่ของ `docs/PROFILE.md` | human | P1 | ก่อน ship | แก้นอกเซสชัน Claude · ยังไม่ commit |
| L5 | ทดสอบ keyboard Tab ด้วยมือ (nav → form → Send) | human | P2 | ก่อน ship | MCP browser ถูกแชร์ระหว่างวัด |
| L6 | Guestbook API: validate/strip HTML (defense in depth) | OpenCode | P2 | ทางเลือก | frontend escape แล้ว (A1) |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-25 (ไฟล์มีจริงใน docs/ แล้ว) |
| L2 | Lab 05: implement `insertContact`/`insertGuestbook`/`listGuestbook` ใน `src/lib/db.ts` จน `npm run test:labs` เขียว | 2026-09-25 (2 passed) |
| L4 | a11y P2: A7 field errors · A8 required marker · A9 skip link | 2026-09-25 (ดู `docs/QA.md` Progress) |
| — | Lab 06: E2E + a11y P0/P1 (A1–A6, F2, F4, F5) | 2026-09-25 (ดู `docs/QA.md` Progress) |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
