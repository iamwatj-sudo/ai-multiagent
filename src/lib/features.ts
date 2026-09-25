/**
 * UI feature switches (frontend-owned).
 *
 * CONTACT_FORM_OPEN — DECISIONS D10: one switch in one file controls
 *   (1) the "ยังไม่เปิดรับข้อความ" banner on /contact,
 *   (2) the disabled form/submit button on /contact,
 *   (3) the hidden "ถามผม" CTA on the home page.
 * Flip to `true` only after tests/labs/lab05-api.test.ts is green
 * (OPEN_LOOPS L6 · owner Claude `frontend`). The page still maps an API 501
 * to a polite Thai message as a safety net if this flag goes stale.
 */
export const CONTACT_FORM_OPEN = false;
