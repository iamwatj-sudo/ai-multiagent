# Decisions — Personal Site

> ปิดจาก [`DEBATE.md`](./DEBATE.md) (ทีม 5 เสียง · 5 รอบ · 2026-09-25) · Facilitator = Claude
> แก้คำตัดสินได้โดยเจ้าของ (วัฒน์) — ถ้าแก้ ให้ระบุวันที่ท้ายแถว

## สรุปการโต้วาที

ทุกเสียงเห็นตรงกันว่า positioning แคบ (นักพัฒนา Web Forms/VB ที่หยุดระบบไม่ได้) คือจุดแข็ง และประเด็นหลักคือ "สัญญาอะไรบนหน้าเว็บได้บ้างโดยไม่เคลมเกิน" Frontend เปิดประเด็นว่า parser ตัด Bio/Interests เหลือบรรทัดแรก ซึ่งกลายเป็น blocker อันดับหนึ่ง Playbook ถูกลดจาก "ระบบบทความ" เหลือหน้า static หน้าเดียวที่บอกตรง ๆ ว่ายังเขียนไม่จบ ส่วนเคสศึกษา Before/After และ Guestbook ถูกเลื่อนออกเพราะเสี่ยง NDA และ spam Devil's Advocate ยก PDPA ขึ้นมาในรอบ 3 ทำให้ทีมตกลงกันว่าจะไม่ประกาศระยะเก็บข้อมูลจนกว่า backend จะลบข้อมูลได้จริง มี dissent ที่บันทึกไว้ 3 ข้อ (D5, D9, D10)

## การตัดสินใจ (ตาราง)

| ID | หัวข้อ | ตัดสินใจ | เหตุผลสั้น | ใครเสนอ (Brand/UX/Devil) |
|----|--------|----------|------------|---------------------------|
| D1 | Parser `profile.ts` | แก้ regex แบบ test-first **ก่อนงาน UI ทุกหน้า** (เทสต์: Bio หลายย่อหน้า · Interests ครบ · หัวข้อท้ายไฟล์) · owner = Claude `frontend` (parser, type `Profile`, `FALLBACK`, เทสต์) · ไม่แตะ db/api | ตอนนี้หน้าเว็บไม่ตรงกับ PROFILE · `profile.ts` ยังไม่มี owner | Frontend + Reviewer · Devil (blocker) |
| D2 | Positioning | audience หลักแคบเท่าเดิม · ห้ามขยายเป็น "AI developer" | niche จริง ปัญหาเจ็บจริง | Brand |
| D3 | Hero (จอแรก) | H1 = `## Tagline` "ย้ายของเก่า โดยไม่ต้องรื้อทั้งหมด" · subline = `## Headline` "Web Forms → ASP.NET Core MVC ทีละส่วน" · CTA เดียว "อ่าน Playbook" | ผู้อ่านบนมือถือต้องรู้ภายในจอแรกว่าเว็บนี้ย้ายอะไร | Brand + UX + Frontend |
| D4 | `## Tagline` ใน PROFILE | เพิ่มหัวข้อที่ parser อ่าน · มี `FALLBACK` ที่ไม่อ้างถึงคอร์ส · ย้ายออกจาก `## Tone` (ไม่ซ้ำสองที่) · guard ครอบคลุม field ใหม่ | tagline ที่ดีที่สุดไม่ขึ้นหน้าเว็บ | Brand + Frontend · เงื่อนไขจาก Reviewer |
| D5 | บรรทัดหลักการบน Hero | บรรทัดเล็กที่สาม "AI เป็นผู้ช่วย · คนตรวจทุกขั้น" (≤1 บรรทัดบนมือถือ) ลิงก์ไป checklist คนตรวจใน Playbook · **ข้อความมาจาก `## Principle` ใน PROFILE ไม่ hardcode** | จุดต่างของแบรนด์ต้องอยู่หน้าแรก และต้องมีหลักฐานรองรับ · *dissent: Reviewer (เสี่ยงเพี้ยน) → รับทางลด: ดึงจาก PROFILE* | Brand · UX (ความยาว) · Devil (ลิงก์หลักฐาน) |
| D6 | คำเรียก AI | ใช้ "AI เป็นผู้ช่วย" คำเดียวทั้งเว็บ | คำสองแบบทำให้จุดยืนดูไม่นิ่ง | Reviewer + Brand |
| D7 | Playbook | `src/pages/playbook.astro` static หน้าเดียว 5 ขั้น (สำรวจ → แยก logic → strangler route → เทสต์ → ตัดของเก่า) · หัวหน้า "ฉบับกำลังเขียน" · H2 ต่อขั้น + ป้ายสถานะเป็น**ข้อความ** "ทำแล้ว / กำลังทดลอง" · มี checklist คนตรวจ · **ห้ามเป็น `.md` page** | ต้องมีของให้ผู้อ่านเอาไปใช้ แต่ห้ามเคลมว่าจบแล้ว · guard สแกนแค่ `.astro/.html` | UX + Devil + Brand · Frontend (รูปแบบไฟล์) |
| D8 | เมนู v1 | Playbook · About · Contact · ลบ `interests.astro` + ลิงก์ใน `BaseLayout.astro` และ `index.astro` ในงานเดียวกัน · Interests ย้ายเข้า About · Bio เต็มอยู่ที่ About | ทุกลิงก์ต้องชี้หน้าที่มีจริง | UX + Frontend · Devil + Reviewer (ลิงก์เสีย) |
| D9 | ฟอร์ม Contact | ป้ายไทย ผม/คุณ · 3 ช่อง: ชื่อ · อีเมล (hint "ใช้ตอบกลับเท่านั้น ไม่แสดงบนเว็บ") · ข้อความ (placeholder "ถามคำถาม หรือเสนอหัวข้อที่อยากให้เขียน") · ลบบรรทัดที่โชว์ endpoint · ไม่แสดง error ดิบ · ยืนยัน "ได้รับข้อความแล้ว ผมจะตอบกลับทางอีเมลที่คุณให้ไว้" ไม่สัญญาเวลา · ไม่เติมคำนำหน้าลงข้อความ | payload เดิม (name/email/message) ไม่ต้องเปลี่ยนสัญญา API · *dissent: Devil (แยกข้อความเสนอหัวข้อไม่ได้) — ช่องประเภทจริงเป็น Later* | UX · Brand · Reviewer |
| D10 | ฟอร์มตอน `/api/contact` ยัง 501 | แถบ "ยังไม่เปิดรับข้อความ" เหนือฟอร์ม + ปุ่มส่ง disabled + ซ่อน CTA "ถามผม" · **สวิตช์ตัวเดียวในไฟล์เดียว** คุมทั้งสามอย่าง · เก็บโค้ดแปลง 501 → ข้อความไทยไว้กันพลาด · พลิกสวิตช์เมื่อ `tests/labs/lab05-api.test.ts` เขียว (OPEN_LOOPS) · ห้ามใช้ "เร็ว ๆ นี้" | ไม่ให้ผู้ใช้เสียแรงพิมพ์ · ไม่มี PII เข้า stub · *dissent: Frontend (flag ค้างผิด) → รับทางลด: สวิตช์เดียว + loop มีเจ้าของ* | Devil + Brand + UX + Reviewer |
| D11 | PDPA | ใต้ฟอร์มแจ้งวัตถุประสงค์ (ใช้ตอบกลับเท่านั้น) ได้ทันที · **ระยะเก็บและวิธีขอลบขึ้นเว็บเมื่อ OpenCode มีกลไกลบจริงแล้วเท่านั้น** | ประกาศแต่ลบไม่ได้ = เคลมเท็จ | Devil · เงื่อนไขจาก Reviewer/UX/Frontend |
| D12 | Bio | "รวบรวมบทเรียน…" → "กำลังจด…" · จำนวนปีใส่ได้เฉพาะตัวเลขจริงจากเจ้าของ (ยังไม่มี = ไม่ใส่) · ถ้ายกเคสให้เป็นสถานการณ์ทั่วไป ไม่มีตัวเลขหรืออุตสาหกรรม | ห้ามเคลมเนื้อหาที่ยังไม่มี | Devil + Brand |
| D13 | ธีม | สว่างเป็นค่าเริ่มต้น (off-white อุ่น) + `prefers-color-scheme: dark` ผ่านตัวแปรใน `:root` | "อ่านนานไม่ล้า" สำหรับ Playbook ยาวที่มีโค้ด · ต้นทุนต่ำ | UX + Brand · Frontend (ต้นทุน) |
| D14 | a11y ขั้นต่ำ (Must Lab 04) | `<label for>` ครบ · status `aria-live="polite"` · H1 เดียวต่อหน้า · `lang="th"` · contrast ≥ 4.5:1 · focus มองเห็นได้ | ฐานที่รีวิวได้จริง | Reviewer + UX |
| D15 | Guard ข้อความหลุด | ขยาย regex ให้จับ "course/คอร์ส" · ตรวจผล `loadProfile()` ทุก field · แก้ `<meta description>` ใน `BaseLayout.astro` ที่มี "course" · เพิ่มเทสต์ตรวจ HTML ที่ render จริงของ `/`, `/about`, `/playbook` | guard ตอนนี้ตรวจแค่ source `.astro` | Reviewer + Frontend |
| D16 | ข้อมูลติดต่อ | ไม่โชว์อีเมลดิบ · ไม่ลิงก์ GitHub จนเจ้าของยืนยัน handle จริง | placeholder = ลิงก์เสีย · handle อาจเป็นของคนอื่น | Devil + Reviewer |

### PROFILE ที่แก้ตาม DECISIONS (2026-09-25)

- เพิ่ม `## Tagline` (D4) และ `## Principle` (D5) · ลบบรรทัด tagline ออกจาก `## Tone` (D4)
- `## Headline` → "Web Forms → ASP.NET Core MVC ทีละส่วน" (D3)
- `## Bio` ย่อหน้าสุดท้าย "รวบรวมบทเรียน…" → "กำลังจดบทเรียน…" (D12)
- หมายเหตุ: `## Tagline` / `## Principle` จะขึ้นเว็บหลัง D1 + D4 เสร็จ (ตอนนี้ parser ยังไม่อ่าน)

## สิ่งที่เลื่อนออก (Out of scope v1)

- เคสศึกษาไม่ระบุชื่อ + Before/After โค้ด — รอ checklist NDA (ห้ามตัวเลข อุตสาหกรรม prompt/output ดิบจากงานจริง)
- Guestbook — รอ moderation ก่อนแสดง + rate limit + ห้าม `innerHTML` (งาน OpenCode) · ห้ามเรียกว่า "หลักฐาน"
- ช่องประเภท "ถามคำถาม/เสนอหัวข้อ" ในฟอร์ม — เปลี่ยน payload ต้อง handoff OpenCode หลัง Lab 05
- คลัง prompt — ถ้าทำต้องเขียนใหม่แบบทั่วไปเท่านั้น
- ระบบบทความ / collection / tag / RSS / เวอร์ชันอังกฤษ
- Audience รอง (tech lead ผู้ตัดสินใจย้าย) — Brand เสนอ ไม่มีใครโต้ · ให้เจ้าของตัดสิน

## เกณฑ์พร้อม Frontend (Lab 04)

- D1 เสร็จ: เทสต์ parser ใหม่เขียว · `loadProfile()` คืน Bio ครบทุกย่อหน้า Interests ครบ และมี `tagline`/`principle`
- มี handoff ถึง OpenCode แล้ว: การแก้ parser เปลี่ยนผล `api/interests.ts` · D10 (สวิตช์ 501) · D11 (กลไกลบ) · ช่องประเภท (Later)
- ขอบเขต Lab 04 ล็อกที่ Home (D3/D5) · About (Bio + Interests) · Playbook (D7) · Contact (D9–D11) · ลบ Interests page (D8) · ธีม (D13)
- ทุกหน้าผ่าน a11y D14 · เมนูทุกลิงก์ตอบ 200 · `npm test` เขียว (รวม guard D15)
- ไม่มีข้อความเคลมเกิน: ไม่มี "เร็ว ๆ นี้" · ไม่มีระยะเก็บข้อมูล · ไม่มีตัวเลขปีที่เจ้าของยังไม่ยืนยัน

## GitHub Issues (Lab 03 · 2026-09-25)

| Issue # | Title | มาจาก Decision |
|---|---|---|
| [#1](https://github.com/iamwatj-sudo/ai-multiagent/issues/1) | [D1] Parser profile.ts: แก้ regex แบบ test-first ก่อนงาน UI | D1 (L2) |
| [#2](https://github.com/iamwatj-sudo/ai-multiagent/issues/2) | [D2][D6] Positioning แคบ + ใช้คำ "AI เป็นผู้ช่วย" คำเดียวทั้งเว็บ | D2, D6 |
| [#3](https://github.com/iamwatj-sudo/ai-multiagent/issues/3) | [D3] Hero จอแรก: H1 = Tagline · subline = Headline · CTA "อ่าน Playbook" | D3 |
| [#4](https://github.com/iamwatj-sudo/ai-multiagent/issues/4) | [D4] เพิ่ม ## Tagline ใน PROFILE ที่ parser อ่าน + FALLBACK + guard | D4 |
| [#5](https://github.com/iamwatj-sudo/ai-multiagent/issues/5) | [D5] บรรทัดหลักการบน Hero จาก ## Principle ลิงก์ไป checklist คนตรวจ | D5 |

## Lab 03 — MCP vs gh

- **ความเร็ว:** MCP สร้าง #1–#5 ได้ในเทิร์นเดียว (เรียกขนานกัน 5 ครั้ง) และ agent เช็คซ้ำ/label ก่อนได้เอง · `gh` สร้างทีละคำสั่ง แต่ไม่ต้องผ่านการคิดของ agent และเขียนเป็นสคริปต์ได้ถ้างานซ้ำ ๆ
- **สิทธิ์:** MCP ใช้ token ที่ตั้งไว้ใน config ของ MCP server ทำได้ทุกอย่างที่ scope ของ token อนุญาต คุมได้ผ่าน permission prompt ของ harness · `gh` ใช้ token ของ `gh auth login` (เก็บใน keyring) และคนเป็นคนกดรันเอง · ทั้งสองทางห้ามเอา token ไปใส่ในไฟล์ที่ commit
- **Audit trail:** ทั้งสองทางขึ้นบน GitHub ในชื่อบัญชีเดียวกัน · MCP มีบันทึก prompt → tool call → ผลลัพธ์อยู่ใน transcript ของ Claude · `gh` มีแค่ shell history และข้อความที่คนพิมพ์ ไม่มีเหตุผลกำกับ
- **ข้อผิดพลาดที่เจอ (MCP):** `get_me` เจอ ECONNRESET ครั้งหนึ่ง (ไม่ใช่ 401 · เรียกอื่นผ่านหมด) · ใน #1 เขียน cross-ref ผิดเป็น `#D4` จึงต้องแก้ด้วยการ update · ลิงก์ `docs/DECISIONS.md` ใน issue เป็น 404 จนกว่าจะ commit + push · ฝั่ง `gh` ให้ระวัง repo default ตอน clone มาจาก template/fork (ใส่ `-R` ทุกครั้ง) และ encoding ภาษาไทยใน PowerShell (ส่ง body เป็นไฟล์ UTF-8)
- **เมื่อไหร่ใช้อะไร:** MCP เหมาะเมื่อต้องอ่าน docs แล้วแปลงเป็นหลาย issue พร้อมเช็คซ้ำ (งานแบบ Lab 03) · `gh` เหมาะกับ issue เดียวที่รู้เนื้อหาแล้ว, งานใน CI/สคริปต์, หรือตอน MCP/token มีปัญหา · `gh issue create --web` ใช้เป็น draft ให้คนตรวจก่อนกด publish
