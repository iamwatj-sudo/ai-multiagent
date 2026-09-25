import { describe, it, expect } from 'vitest';
import { parseProfile, loadProfile, FALLBACK } from '../src/lib/profile';

// D1 (issue #1): the old regex used `$` with flag `m`, so each section stopped
// at the first line break — Bio got one paragraph, Interests got one item.
const SAMPLE = `# PROFILE

## Name
Sample Person

## Tagline
Short tagline

## Headline
Sub headline

## Principle
One principle line

## Bio
First paragraph.

Second paragraph.

Third paragraph.

## Audience
Some readers

## Interests
- One
- Two
- Three`;

describe('parseProfile', () => {
  const p = parseProfile(SAMPLE);

  it('keeps every Bio paragraph', () => {
    expect(p.bio).toBe('First paragraph.\n\nSecond paragraph.\n\nThird paragraph.');
  });

  it('reads all Interests, even when the section ends the file', () => {
    expect(p.interests).toEqual(['One', 'Two', 'Three']);
  });

  it('does not bleed into the next section', () => {
    expect(p.name).toBe('Sample Person');
    expect(p.audience).toBe('Some readers');
  });

  it('reads Tagline and Principle (D4, D5)', () => {
    expect(p.tagline).toBe('Short tagline');
    expect(p.headline).toBe('Sub headline');
    expect(p.principle).toBe('One principle line');
  });

  it('matches headings exactly — "## Name" does not match "## Names"', () => {
    const q = parseProfile('## Names\nwrong\n\n## Name\nright\n');
    expect(q.name).toBe('right');
  });

  it('uses FALLBACK for missing or empty sections', () => {
    const q = parseProfile('## Name\n\n## Bio\n');
    expect(q).toEqual(FALLBACK);
  });

  it('handles CRLF line endings', () => {
    const q = parseProfile(SAMPLE.replace(/\n/g, '\r\n'));
    expect(q.interests).toEqual(['One', 'Two', 'Three']);
    expect(q.bio.split('\n\n')).toHaveLength(3);
  });
});

describe('loadProfile (docs/PROFILE.md)', () => {
  it('returns the full Bio and all Interests from the real file', () => {
    const p = loadProfile();
    expect(p.bio.split(/\n\s*\n/).length).toBeGreaterThan(1);
    expect(p.interests.length).toBeGreaterThan(1);
    expect(p.tagline).toBeTruthy();
    expect(p.principle).toBeTruthy();
  });
});
