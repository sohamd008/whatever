const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
});

const normalizeSlug = (value) => value
  .trim()
  .toLowerCase()
  .replace(/\s+/g, '-');

const isValidSlug = (value) => /^[a-z0-9-]{3,40}$/.test(value);
const createSlug = () => crypto.randomUUID().replace(/-/g, '').slice(0, 8);

export async function onRequestPost({ request, env }) {
  if (!env.LINKS) {
    return json({
      error: 'Cloudflare KV namespace "LINKS" not found. Bind it before using the shortener.',
    }, 500);
  }

  try {
    const { url, slug } = await request.json();
    const rawUrl = typeof url === 'string' ? url.trim() : '';
    if (!rawUrl) return json({ error: 'URL is required.' }, 400);

    let destination;
    try {
      destination = new URL(rawUrl);
    } catch {
      return json({ error: 'Enter a valid absolute URL.' }, 400);
    }

    if (!['http:', 'https:'].includes(destination.protocol)) {
      return json({ error: 'Only http and https URLs are supported.' }, 400);
    }

    const requestUrl = new URL(request.url);
    if (destination.origin === requestUrl.origin && destination.pathname.startsWith('/s/')) {
      return json({ error: 'Short links cannot point at other short links on this site.' }, 400);
    }

    const customSlug = typeof slug === 'string' && slug.trim() ? normalizeSlug(slug) : '';
    if (customSlug && !isValidSlug(customSlug)) {
      return json({ error: 'Custom slugs must be 3-40 characters using only letters, numbers, and hyphens.' }, 400);
    }

    let finalSlug = customSlug;
    if (finalSlug) {
      const existing = await env.LINKS.get(finalSlug);
      if (existing) return json({ error: 'Slug already exists.' }, 409);
    } else {
      for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = createSlug();
        const existing = await env.LINKS.get(candidate);
        if (!existing) {
          finalSlug = candidate;
          break;
        }
      }
    }

    if (!finalSlug) {
      return json({ error: 'Unable to generate a unique slug right now. Try again.' }, 500);
    }

    await env.LINKS.put(finalSlug, destination.toString());
    return json({ slug: finalSlug });
  } catch (err) {
    return json({ error: err.message || 'Unexpected error while creating short URL.' }, 500);
  }
}
