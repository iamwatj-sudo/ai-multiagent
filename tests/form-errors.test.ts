import { describe, it, expect } from 'vitest';
import { fieldForError } from '../src/lib/form-errors';

describe('fieldForError', () => {
  const fields = ['name', 'email', 'message'];

  it('maps API validation messages to the field they start with', () => {
    expect(fieldForError('Name is required', fields)).toBe('name');
    expect(fieldForError('Email is invalid', fields)).toBe('email');
    expect(fieldForError('Message is too long (max 2000 characters)', fields)).toBe('message');
  });

  it('returns null for errors not tied to a field', () => {
    expect(fieldForError('Invalid JSON body', fields)).toBeNull();
    expect(fieldForError('Failed to save contact message', fields)).toBeNull();
    expect(fieldForError('', fields)).toBeNull();
  });

  it('only matches fields present on the form', () => {
    expect(fieldForError('Email is invalid', ['name', 'message'])).toBeNull();
  });
});
