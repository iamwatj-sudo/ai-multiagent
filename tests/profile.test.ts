import { describe, it, expect } from 'vitest';
import { parseProfile } from '../src/lib/profile';

const raw = [
  '# PROFILE',
  '',
  '## Name',
  'Wat',
  '',
  '## Bio',
  'First paragraph.',
  '',
  'Second paragraph.',
  '',
  '## Interests',
  '- One',
  '- Two',
  '- Three',
  '',
  '## Contact',
  '- email: demo@example.com',
  '',
].join('\r\n');

describe('parseProfile', () => {
  it('keeps every line of a multi-line section', () => {
    const p = parseProfile(raw);
    expect(p.bio).toBe('First paragraph.\n\nSecond paragraph.');
    expect(p.interests).toEqual(['One', 'Two', 'Three']);
  });

  it('stops a section at the next heading', () => {
    expect(parseProfile(raw).interests).not.toContain('email: demo@example.com');
  });

  it('falls back for missing sections', () => {
    const p = parseProfile('## Name\nWat\n');
    expect(p.name).toBe('Wat');
    expect(p.headline).toBeTruthy();
    expect(p.interests.length).toBeGreaterThan(0);
  });
});
