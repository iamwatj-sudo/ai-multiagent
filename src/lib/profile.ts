/**
 * Profile helpers. Learners fill docs/PROFILE.md in Lab 01.
 * Parser owned by Claude `frontend` (DECISIONS D1) — src/pages/api/interests.ts
 * also calls loadProfile(), so output changes here affect that endpoint.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export type Profile = {
  name: string;
  /** Hero H1 (D3/D4) */
  tagline: string;
  /** Hero subline (D3) */
  headline: string;
  /** Small principle line under the hero (D5) */
  principle: string;
  /** Paragraphs separated by a blank line */
  bio: string;
  audience: string;
  interests: string[];
};

/**
 * FALLBACK renders publicly when docs/PROFILE.md is missing or a section is
 * empty — keep it course-free (no lab references); learner hints belong in
 * comments and docs, not in rendered fallback text.
 */
export const FALLBACK: Profile = {
  name: 'Your Name',
  tagline: 'Personal site',
  headline: 'Personal branding site',
  principle: 'Writing down what I learn along the way',
  bio: 'This personal site is still being built.',
  audience: 'Hiring managers / peers / community',
  interests: ['AI agents', 'Web', 'Teaching'],
};

function profilePath(): string {
  const candidates = [
    join(process.cwd(), 'docs', 'PROFILE.md'),
    join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'docs', 'PROFILE.md'),
  ];
  return candidates.find((p) => existsSync(p)) || candidates[0];
}

/** Split markdown into `## Heading` → body. Only level-2 headings start a section. */
function sections(raw: string): Map<string, string> {
  const out = new Map<string, string>();
  let current: string | null = null;
  let buf: string[] = [];
  const flush = () => {
    if (current !== null && !out.has(current)) out.set(current, buf.join('\n').trim());
  };
  for (const line of raw.replace(/\r\n?/g, '\n').split('\n')) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      flush();
      current = h[1];
      buf = [];
    } else if (current !== null) {
      buf.push(line);
    }
  }
  flush();
  return out;
}

export function parseProfile(raw: string): Profile {
  const s = sections(raw);
  const get = (label: string) => s.get(label) || '';
  const interests = get('Interests')
    .split('\n')
    .map((l) => l.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
  return {
    name: get('Name') || FALLBACK.name,
    tagline: get('Tagline') || FALLBACK.tagline,
    headline: get('Headline') || FALLBACK.headline,
    principle: get('Principle') || FALLBACK.principle,
    bio: get('Bio') || FALLBACK.bio,
    audience: get('Audience') || FALLBACK.audience,
    interests: interests.length ? interests : FALLBACK.interests,
  };
}

export function loadProfile(): Profile {
  const path = profilePath();
  if (!existsSync(path)) return FALLBACK;
  return parseProfile(readFileSync(path, 'utf8'));
}

/** Bio split into paragraphs for rendering as separate <p>. */
export function paragraphs(text: string): string[] {
  return text.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
}
