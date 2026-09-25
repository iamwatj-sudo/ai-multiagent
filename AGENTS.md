# Agents — Build AI Multi-Agent Lab (V4)

กติการ่วม **Claude Code** ↔ **OpenCode** (อ่านทุกเซสชัน — `CLAUDE.md` ชี้มาที่ไฟล์นี้)
สินค้า = เว็บ personal branding (Astro SSR) · repo เดียวกับ Labs 00–08

## Start-of-session (บังคับ)

1. อ่าน `docs/STATUS.md` + `docs/OPEN_LOOPS.md` (ยังไม่มี = คัดลอกจาก `*.md.example` ใน Lab 00)
2. มี handoff ล่าสุดใน `docs/handoffs/` ที่ส่งถึงคุณ → อ่านด้วย
3. สรุปก่อนลงมือ: Goal · Latest D-id · Open loops · Blockers — **ไม่เกิน 8 บรรทัด**
4. **ห้าม**สมมุติสิ่งที่เกิดในแชทของ CLI อีกฝั่ง — ต้องมีใน `docs/` เท่านั้น

จบงานที่เปลี่ยนสถานะ: อัปเดต `STATUS.md` / `OPEN_LOOPS.md` · สลับ harness → เขียน handoff จาก `docs/handoffs/TEMPLATE.md`

## Commands (Windows PowerShell)

```powershell
npm install                    # Node >= 22.12 (CI ใช้ Node 22)
npm run dev                    # http://127.0.0.1:4321
npm test                       # unit tests — ไม่รวม tests/labs
npm run test:labs              # เฉพาะ tests/labs — RED ได้ถูกต้อง (ดูด้านล่าง)
npm run test:e2e               # Playwright — ต้องรัน npm run dev ค้างไว้ก่อน (ไม่มี webServer ใน config)
npm run build && npm start     # SSR build → node ./dist/server/entry.mjs
node scripts/create-course-issues.mjs   # สร้าง Issues คอร์ส (ต้องมี GITHUB_PERSONAL_ACCESS_TOKEN ใน .env)
```

## Test quirks (สิ่งที่ agent เดาผิดบ่อย)

- `npm test` **exclude** `tests/labs/**` · `test:labs` include เฉพาะ `tests/labs/**` — สองชุดไม่ซ้ำกัน
- `tests/labs/lab05-api.test.ts` **ตั้งใจให้ RED บน template ล้าง** — `src/lib/db.ts` ยังเป็น stub ที่ throw `NOT_IMPLEMENTED` (Lab 05 ต้อง implement `insertContact` / `insertGuestbook` / `listGuestbook` ให้เขียว)
- `tests/public-site.test.ts` สแกน **markup ที่ render ออกจริง** ทุก `.astro`/`.html` — ห้ามมีคำว่า "lab(s)" หรือ "แล็บ" อยู่ใน output (frontmatter/HTML comment ถูก strip ก่อนสแกน) · พูดถึง Lab ได้เฉพาะในคอมเมนต์ `.ts` / PR / `docs/`
- CI (`.github/workflows/ci.yml`) = `npm ci` → `npm test` → `npm run build` บน push/PR สาย main — **ไม่รัน** lab tests และ E2E
- Playwright: testDir `./playwright` · baseURL `http://127.0.0.1:4321` (override ด้วย `PLAYWRIGHT_BASE_URL`) · config ไม่มี `webServer` — ต้องสตาร์ท dev server เอง

## Architecture

- **Astro SSR** (`output: 'server'` + Node standalone adapter) — ไม่ใช่ static · port 4321 ตายตัวใน `astro.config.mjs`
- API routes: `src/pages/api/{contact,guestbook,interests}.ts` — ใช้ `src/lib/db.ts` (better-sqlite3)
- SQLite: ไฟล์ `$DATA_DIR/site.sqlite` (default `./data` — สร้างเองตอน first query, อย่า commit)
- `src/lib/profile.ts` parse `docs/PROFILE.md` ด้วย heading ตรงตัว `## Name` / `## Headline` / `## Bio` / `## Audience` / `## Interests` — ขาดส่วนไหน fallback สาธารณะจะ render แทน (ห้ามมีคำว่า lab ใน fallback)

## Ownership (ผูกกับไฟล์ agent จริง)

| Artifact | Owner |
|---|---|
| UI (`src/pages/*.astro`, `src/layouts/`, styles) | Claude · `.claude/agents/frontend.md` |
| API + SQLite (`src/lib/db.ts`, `src/pages/api/*`) | OpenCode · `.opencode/agents/backend.md` |
| E2E / a11y (`docs/QA.md`) | Playwright MCP + either CLI |
| PROFILE / DEBATE / DECISIONS docs | Claude (Lab 01–02 · subagents แล้วทิ้ง) |
| Review | `.claude/agents/reviewer.md` / OpenCode review (Lab 07) |

- **Single-writer** ต่อรอบสำหรับ `STATUS.md` / `OPEN_LOOPS.md` — สลับ Claude ↔ OpenCode หลัง commit หรือเขียน handoff
- Proposed ≠ Approved: `DEBATE.md` ยังไม่ปิด · ปิดแล้วเท่านั้นลง `DECISIONS.md`
- ใช้ skill **`public-site-safe`** ทุกงาน implement / swarm / ship (มีทั้ง `.claude/skills/` และ `.opencode/skills/`)

## Cross-harness call (Lab 04/05/07)

- ฝั่ง OpenCode เรียก `claude -p` · ฝั่ง Claude เรียก `opencode run` — headless **one-shot** เท่านั้น (ขั้นตอน: `.opencode/skills/claude-code/SKILL.md`)
- ฝั่งที่ถูกเรียกเขียนได้**เฉพาะไฟล์รายงาน**ที่ prompt ระบุ (เช่น `docs/review-*.md`) — ห้ามแตะไฟล์ ownership ของผู้เรียก
- ท่อ = ไฟล์ใน `docs/` · commit ก่อนให้อีก harness แตะ working tree
- **ห้าม**: สร้าง message bus / daemon / loop ระหว่าง CLI · ใช้ MCP เป็นท่อส่งงาน
- OpenCode persistent memory = `AGENTS.md` + agent file + **resume session** — ห้ามสร้าง memory bus เอง (ไม่ติดตั้ง Mem0 ฯลฯ) · Claude ใช้ `memory: project`

## Swarm (Lab 05b)

หยุดเมื่อ done **หรือ** ครบ **20 turns** — แล้วสรุปช่องว่างลง `docs/SWARM.md` · ห้ามปล่อยรันเกิน

## Setup quirks

- `copy .env.example .env` ก่อนใช้งาน — `.env` ห้าม commit · ค่าสำคัญ: `STUDENT_SLUG`, `SITE_URL` (astro config อ่านตอน build), `DATA_DIR`, `GITHUB_PERSONAL_ACCESS_TOKEN`
- MCP (GitHub + Playwright): คัดลอก `opencode.json.example` → `opencode.json` · `.mcp.json.example` สำหรับ Claude

## ห้าม

- Commit `.env` / PAT / Coolify webhook / `node_modules` / `data/`
- เคลม deploy สำเร็จโดยไม่มี URL 200 จริง
- PR เข้า `Onto-IQ/*` — เข้า learner repo เท่านั้น (template คือ `Onto-IQ/build-ai-multi-agent-lab`)
- บังคับ tmux บน Windows (Agent Teams ใช้ in-process)
- ปล่อย swarm เกิน 20 turns โดยไม่สรุปหยุด

## ชั้นความรู้ (อ่านตามงาน)

Rules = ไฟล์นี้ + `CLAUDE.md` + skill `public-site-safe` · Context = `COURSE.md` / `docs/PROFILE.md` / `docs/DECISIONS.md` · Hot state = `docs/STATUS.md` / `docs/OPEN_LOOPS.md` · Labs ลำดับ = [`labs/README.md`](./labs/README.md)
