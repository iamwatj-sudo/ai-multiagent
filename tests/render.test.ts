import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadProfile, FALLBACK, paragraphs } from '../src/lib/profile';
import Home from '../src/pages/index.astro';
import About from '../src/pages/about.astro';
import Playbook from '../src/pages/playbook.astro';
import Contact from '../src/pages/contact.astro';
import Guestbook from '../src/pages/guestbook.astro';

/**
 * D15: the source-level guard in public-site.test.ts can't see text that
 * comes from loadProfile() or FALLBACK, so render the real pages and scan the
 * HTML that visitors actually get. Also checks D3/D5/D8/D9/D10/D14 basics.
 */
const LEAK = /\blabs?\b\s*[-–—]?\s*0?\d+\b|แล็บ|\bcourses?\b|คอร์ส|\bworkshops?\b|เวิร์กช็อป/i;

// Drop <script>/<style> bodies — they are not visible text.
const visible = (html: string) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');

const pages = {
  '/': Home,
  '/about': About,
  '/playbook': Playbook,
  '/contact': Contact,
  '/guestbook': Guestbook,
} as const;

const html: Record<string, string> = {};

beforeAll(async () => {
  const container = await AstroContainer.create();
  for (const [path, page] of Object.entries(pages)) {
    html[path] = await container.renderToString(page, {
      request: new Request(`http://localhost${path}`),
    });
  }
});

describe('rendered pages', () => {
  it.each(Object.keys(pages))('%s has no course references', (path) => {
    expect(visible(html[path]).match(LEAK)?.[0]).toBeUndefined();
  });

  it.each(Object.keys(pages))('%s has lang="th" and exactly one <h1> (D14)', (path) => {
    expect(html[path]).toContain('<html lang="th"');
    expect(html[path].match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it('nav links only to pages that exist (D8)', () => {
    const hrefs = [...html['/'].matchAll(/<nav[\s\S]*?<\/nav>/g)][0][0].matchAll(/href="([^"#]+)/g);
    for (const [, href] of hrefs) {
      expect(['/', ...Object.keys(pages)]).toContain(href);
    }
    expect(html['/']).not.toContain('href="/interests"');
  });

  it('home hero: H1 = Tagline, subline = Headline, principle links to checklist (D3/D5)', () => {
    const p = loadProfile();
    expect(html['/']).toMatch(new RegExp(`<h1[^>]*>${p.tagline}</h1>`));
    expect(html['/']).toContain(p.headline);
    expect(html['/']).toContain('href="/playbook#checklist"');
    expect(html['/']).toContain('อ่าน Playbook');
    expect(html['/playbook']).toContain('id="checklist"');
  });

  it('about renders every Bio paragraph and every Interest (D1/D8)', () => {
    const p = loadProfile();
    for (const para of paragraphs(p.bio)) expect(html['/about']).toContain(para);
    for (const item of p.interests) expect(html['/about']).toContain(item);
    expect(html['/about']).toContain('id="interests"');
  });

  it('contact: Thai labels, no endpoint shown, closed state while the API is a stub (D9/D10)', () => {
    const c = visible(html['/contact']);
    for (const id of ['name', 'email', 'message']) expect(c).toContain(`for="${id}"`);
    expect(c).not.toContain('/api/contact');
    expect(c).toContain('ยังไม่เปิดรับข้อความ');
    expect(c).toMatch(/<fieldset[^>]*disabled/);
    expect(html['/']).not.toContain('ถามผม');
  });

  it('no over-claiming copy', () => {
    for (const h of Object.values(html)) expect(visible(h)).not.toMatch(/เร็ว ๆ นี้|coming soon/i);
  });
});

describe('profile text shown on the site', () => {
  it('loadProfile() and FALLBACK have no course references in any field (D15)', () => {
    for (const profile of [loadProfile(), FALLBACK]) {
      for (const value of Object.values(profile)) {
        const text = Array.isArray(value) ? value.join('\n') : value;
        expect(text.match(LEAK)?.[0]).toBeUndefined();
      }
    }
  });
});
