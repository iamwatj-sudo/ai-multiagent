import type { APIRoute } from 'astro';
import { insertGuestbook, listGuestbook, ValidationError } from '../../lib/db';

export const prerender = false;

/** GET /api/guestbook — newest entries, capped server-side. */
export const GET: APIRoute = async () => {
  try {
    const rows = listGuestbook();
    return new Response(JSON.stringify({ entries: rows }), {
      status: 200,
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
    console.error('guestbook list failed');
    return new Response(JSON.stringify({ error: 'Failed to list guestbook' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};

/** POST /api/guestbook — validate JSON {name,message}, persist, return 201. */
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
    const row = insertGuestbook(body);
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
    console.error('guestbook insert failed');
    return new Response(
      JSON.stringify({ error: 'Failed to save guestbook entry' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }
};
