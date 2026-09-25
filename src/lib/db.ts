/**
 * SQLite helpers for contact + guestbook.
 * Lab 05 (OpenCode) — persistence implemented with better-sqlite3.
 *
 * Design notes:
 * - getDb() caches one connection per DATA_DIR; reopens automatically if DATA_DIR changes
 *   (vitest re-inits by setting process.env.DATA_DIR before calling getDb()).
 * - All user input is validated here; failures throw ValidationError (400 in API routes).
 * - Error messages are safe for users: no SQL, stack traces, or internal details.
 * - Never log user input or secrets.
 */
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

/** Thrown for invalid user input — API routes map this to HTTP 400. */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const MAX_NAME = 60;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let db: Database.Database | null = null;
let dbDir: string | null = null;

export function getDb(): Database.Database {
  const dir = process.env.DATA_DIR || join(process.cwd(), 'data');
  if (db && dbDir === dir) return db;
  if (db) {
    try {
      db.close();
    } catch {
      // Stale handle — safe to drop.
    }
    db = null;
  }
  mkdirSync(dir, { recursive: true });
  const next = new Database(join(dir, 'site.sqlite'));
  next.pragma('journal_mode = WAL');
  next.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  db = next;
  dbDir = dir;
  return db;
}

/** Validate a required string field: must be a string, trimmed, within cap. */
function requireString(
  value: unknown,
  label: string,
  cap: number,
): string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${label} is required`);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new ValidationError(`${label} is required`);
  }
  if (trimmed.length > cap) {
    throw new ValidationError(`${label} is too long (max ${cap} characters)`);
  }
  return trimmed;
}

/** Validate a contact/guestbook JSON body coming from the API routes. */
function requireBody(input: unknown): Record<string, unknown> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new ValidationError('Invalid request body');
  }
  return input as Record<string, unknown>;
}

/** Insert a validated contact message; returns the persisted row. */
export function insertContact(input: {
  name: string;
  email: string;
  message: string;
}): ContactMessage {
  const body = requireBody(input);
  const name = requireString(body.name, 'Name', MAX_NAME);
  const emailRaw = requireString(body.email, 'Email', MAX_EMAIL);
  const email = emailRaw.toLowerCase();
  if (!EMAIL_RE.test(email)) {
    throw new ValidationError('Email is invalid');
  }
  const message = requireString(body.message, 'Message', MAX_MESSAGE);

  const dbh = getDb();
  const info = dbh
    .prepare('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)')
    .run(name, email, message);
  const id = Number(info.lastInsertRowid);
  const row = dbh
    .prepare('SELECT id, name, email, message, created_at FROM contact_messages WHERE id = ?')
    .get(id) as ContactMessage;
  return row;
}

/** Insert a validated guestbook entry; returns the persisted row. */
export function insertGuestbook(input: {
  name: string;
  message: string;
}): GuestbookEntry {
  const body = requireBody(input);
  const name = requireString(body.name, 'Name', MAX_NAME);
  const message = requireString(body.message, 'Message', MAX_MESSAGE);

  const dbh = getDb();
  const info = dbh
    .prepare('INSERT INTO guestbook (name, message) VALUES (?, ?)')
    .run(name, message);
  const id = Number(info.lastInsertRowid);
  const row = dbh
    .prepare('SELECT id, name, message, created_at FROM guestbook WHERE id = ?')
    .get(id) as GuestbookEntry;
  return row;
}

/** List guestbook entries, newest first, capped server-side. */
export function listGuestbook(): GuestbookEntry[] {
  const dbh = getDb();
  const rows = dbh
    .prepare('SELECT id, name, message, created_at FROM guestbook ORDER BY id DESC LIMIT 100')
    .all() as GuestbookEntry[];
  return rows;
}
