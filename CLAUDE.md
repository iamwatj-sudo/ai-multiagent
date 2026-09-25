# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

# Claude Code — seed คอร์ส (อย่าลบตอน /init)

หลัง Lab 00 ให้ `/init` **merge** — เก็บกฎด้านล่างไว้เสมอ

## สี่เสา (ย่อ)

1. Multi-Agent แยกหน้าที่/ความจำ · 2. Sub-Agent ใช้แล้วทิ้ง · 3. ประสานผ่าน docs/PR · 4. Swarm เพดาน **20 turns**

## Ownership (บังคับ)

| Artifact | Owner |
|---|---|
| UI | Claude · `.claude/agents/frontend.md` |
| API + SQLite | OpenCode · `.opencode/agents/backend.md` |
| docs PROFILE / DEBATE / DECISIONS | Claude (Lab 01–02) |
| Hot state STATUS / OPEN_LOOPS | ผู้ถืองานรอบนั้น (single-writer) |

## Canonical context (อ่านก่อน · อย่าคัดลอกซ้ำในไฟล์นี้)

ก่อนลงมือ:

1. `docs/STATUS.md`
2. `docs/OPEN_LOOPS.md`
3. handoff ล่าสุดใน `docs/handoffs/` (ถ้ามี)
4. ตามงาน: `docs/PROFILE.md` · `docs/DECISIONS.md`

สรุป Goal / Latest D-id / Open loops / Blockers **ไม่เกิน 8 บรรทัด**  
ห้ามสมมุติจากแชท OpenCode ถ้าไม่มีใน `docs/`  
จบงานที่เปลี่ยนสถานะ → อัปเดต STATUS / OPEN_LOOPS · สลับ harness → เขียน handoff จาก [`docs/handoffs/TEMPLATE.md`](docs/handoffs/TEMPLATE.md)

## กฎสั้น

- Root เท่านั้น · plugin **project scope**
- Skill **`public-site-safe`**
- Agent ถาวรใช้ `memory: project` (harness) — ตรวจใน Lab 00 · ห้ามสร้าง memory bus เอง
- MCP ไม่ใช่ท่อ Claude ↔ OpenCode · Cross-CLI เฉพาะ Lab 07
- ห้าม commit `.env` · PR เข้า learner repo เท่านั้น
- Swarm: หยุดเมื่อ done หรือครบ 20 turns
- STATUS/OPEN_LOOPS = single-writer · commit ก่อนสลับ harness

## Labs

ดู [`labs/README.md`](labs/README.md) · เริ่ม [`lab-00-project-init`](labs/lab-00-project-init/README.md)

---

# Codebase notes (เพิ่มจาก /init)

## Commands (Node ≥ 22.12)

```powershell
npm run dev                                   # astro dev → http://localhost:4321
npm test                                      # vitest: tests/*.test.ts (ไม่รวม tests/labs)
npm run test:labs                             # vitest: tests/labs/** — RED บน template สดจนกว่า Lab 05 เสร็จ
npx vitest run tests/smoke.test.ts            # รันไฟล์เดียว · เพิ่ม -t "<ชื่อ test>" เพื่อกรอง
npm run test:e2e                              # playwright/ · ต้องมี server รันที่ PLAYWRIGHT_BASE_URL (default 127.0.0.1:4321)
npm run build; npm start                      # build → dist/server/entry.mjs (Node standalone)
```

CI (`.github/workflows/ci.yml`) รัน `npm ci` → `npm test` → `npm run build` — **ไม่**รัน `test:labs`

## Architecture

- **Astro SSR** (`output: 'server'`, `@astrojs/node` standalone) — Dockerfile → Coolify
- **Content มาจาก markdown:** `src/lib/profile.ts` parse `docs/PROFILE.md` ตามหัวข้อ `## Name` / `## Headline` / `## Bio` / `## Audience` / `## Interests` (list) — ขาดหัวข้อไหนใช้ `FALLBACK` · แก้ PROFILE.md ต้องรักษาชื่อหัวข้อเหล่านี้
- **API** (`src/pages/api/*.ts`, `prerender = false`) เรียก `src/lib/db.ts` (better-sqlite3 · `DATA_DIR` หรือ `./data/site.sqlite` · สร้างตารางตอน `getDb()`)
  - `insertContact` / `listGuestbook` / `insertGuestbook` เป็น stub ที่ throw `NOT_IMPLEMENTED…` → route แปลงเป็น **501** · error อื่น → 400/500 (งาน Lab 05 · owner = OpenCode)
- **Guard สำคัญ:** `tests/public-site.test.ts` สแกน markup ที่ render ได้ใน `src/**/*.astro|html` (ตัด frontmatter + HTML comment) — ห้ามมีคำว่า `lab 0x` / `แล็บ` บนหน้าเว็บ · fallback text ใน `profile.ts` ก็ต้องไม่อ้างถึงคอร์ส
- `docs/STATUS.md` / `docs/OPEN_LOOPS.md` มาจากไฟล์ `.example` (คัดลอกใน Lab 00) · issue ของคอร์สอยู่ใน `.github/course-issues/` สร้างด้วย `node scripts/create-course-issues.mjs`
