---
name: project-review-checklist-v1
description: Must ที่ Reviewer ต้องตรวจซ้ำใน review/QA ของ Lab 04+ ผูกกับ D1–D16 ใน docs/DECISIONS.md (debate 2026-09-25) + dissent D5
metadata:
  type: project
---

ที่มา: debate Lab 02 ปิดเมื่อ 2026-09-25 → docs/DECISIONS.md D1–D16 (อ่านต้นฉบับก่อนรีวิว; ถ้า DECISIONS ถูกแก้ ให้ยึดไฟล์)

**Why:** ทีมตกลงว่าจุดเสี่ยงหลักคือ "เคลมเกิน" + ข้อความคอร์สหลุด + parser ไม่ตรง PROFILE
**How to apply:** ใช้เป็น checklist Must ทุก PR ที่แตะ UI / profile.ts / ฟอร์ม Contact

Must ต้องเช็กซ้ำ:
- D1: แก้ regex profile.ts บรรทัด ~42 แบบ test-first ก่อนงาน UI ต้องมีเทสต์ Bio หลายย่อหน้า, Interests ครบ, หัวข้อท้ายไฟล์ ดูประวัติ commit ว่าเทสต์มาก่อน · owner frontend ไม่แตะ db/api
- D4/D5: `tagline`/`principle` อ่านจาก PROFILE มี FALLBACK ที่ไม่อ้างถึงคอร์ส · ไม่ซ้ำใน `## Tone`
- D8: ลบ interests.astro พร้อมลิงก์ใน BaseLayout และ index · เมนูทุกลิงก์ตอบ 200 · handoff OpenCode (api/interests.ts เปลี่ยนผล)
- D9: ห้ามแสดง endpoint หรือ error ดิบ (NOT_IMPLEMENTED/status/stack) · ไม่เติมคำนำหน้าลงข้อความ
- D10: สวิตช์ 501 ต้องเป็น**ตัวเดียวในไฟล์เดียว** คุมแถบแจ้ง + ปุ่ม disabled + ซ่อน CTA "ถามผม" · ยังเก็บโค้ดแปลง 501 ไว้ · มีรายการใน OPEN_LOOPS ผูกกับ lab05-api เขียว · ห้ามคำว่า "เร็ว ๆ นี้"
- D11: ห้ามแสดงระยะเก็บ/วิธีลบจนกว่า OpenCode จะมีกลไกลบจริง (ตรวจ db.ts/handoff)
- D14 a11y: label for · aria-live="polite" · H1 เดียวต่อหน้า · lang="th" · contrast ≥4.5:1 (ทั้งธีมสว่างและมืด D13) · focus มองเห็นได้
- D15: regex จับ course/คอร์ส · ตรวจ loadProfile() ทุก field · meta description ใน BaseLayout ไม่มี "course" · มีเทสต์ HTML ที่ render จริงของ / /about /playbook
- D16: ไม่มีอีเมลดิบ ไม่มีลิงก์ GitHub จนเจ้าของยืนยัน
- ห้าม `innerHTML` กับข้อมูลผู้ใช้ทุกกรณี (guestbook ยังเป็น Later)

Dissent ของผมใน D5 (ข้อความ hardcode ใน Hero จะเพี้ยนจาก PROFILE) → ทางลดที่ทีมรับ: ดึงจาก `## Principle`
- ต้องเช็ก: index.astro ไม่มีสตริง "AI เป็นผู้ช่วย" hardcode · render มาจาก profile.principle · ลิงก์ไป checklist ใน playbook มีอยู่จริง · คำเรียกใช้ "AI เป็นผู้ช่วย" คำเดียว (D6)
