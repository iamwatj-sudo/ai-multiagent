import type { APIRoute } from 'astro';
import { insertContact, ValidationError } from '../../lib/db';

export const prerender = false;

/**
 * POST /api/contact
 * Validate JSON {name,email,message}, persist with insertContact, return 201.
 * Error responses never leak stack / SQL details.
 */
export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  try {
    const row = insertContact(body);
    return new Response(JSON.stringify(row), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }
    // Unexpected error — keep the response generic; no stack or SQL details.
    console.error('contact save failed');
    return new Response(
      JSON.stringify({ error: 'Failed to save contact message' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }
};
