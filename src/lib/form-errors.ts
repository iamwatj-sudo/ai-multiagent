/**
 * Field-level form errors (a11y A7 · WCAG 3.3.1).
 * API validation messages start with the field label ("Name is required",
 * "Email is invalid") — map them back to the input so it gets aria-invalid,
 * a described-by error text, and focus.
 */

export function fieldForError(message: string, fields: string[]): string | null {
  const first = message.trim().split(/\s+/)[0]?.toLowerCase() ?? '';
  return fields.includes(first) ? first : null;
}

/** Remove aria-invalid and error text from every field in the form. */
export function clearFieldErrors(form: HTMLFormElement): void {
  for (const el of form.querySelectorAll<HTMLElement>('[aria-invalid]')) {
    el.removeAttribute('aria-invalid');
  }
  for (const el of form.querySelectorAll<HTMLElement>('.field-error')) {
    el.textContent = '';
    el.hidden = true;
  }
}

/**
 * Mark the field named in `message` as invalid and focus it.
 * Returns true when a field matched (caller can skip the generic status).
 */
export function showFieldError(form: HTMLFormElement, message: string): boolean {
  const fields = Array.from(form.elements)
    .map((el) => (el as HTMLInputElement).name)
    .filter(Boolean);
  const name = fieldForError(message, fields);
  if (!name) return false;
  const input = form.elements.namedItem(name) as HTMLElement | null;
  const error = document.getElementById(`${input?.id}-error`);
  if (!input || !error) return false;
  error.textContent = message;
  error.hidden = false;
  input.setAttribute('aria-invalid', 'true');
  input.focus();
  return true;
}
