const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
});

const isValidSlug = (value) => /^[a-z0-9-]{3,40}$/.test(value);

const listAllKeys = async (namespace) => {
  const keys = [];
  let cursor;

  do {
    const page = await namespace.list({ cursor });
    keys.push(...page.keys);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return keys;
};

export async function onRequest({ request, env }) {
  const authHeader = request.headers.get('x-terminal-auth');
  const serverPass = env.TERMINAL_PASS;

  if (!env.LINKS) return json({ error: 'Cloudflare KV namespace "LINKS" is not configured.' }, 500);
  if (!serverPass || authHeader !== serverPass) return json({ error: 'Unauthorized' }, 401);

  if (request.method === 'GET') {
    try {
      const keys = await listAllKeys(env.LINKS);
      const links = await Promise.all(keys.map(async (key) => ({
        slug: key.name,
        url: await env.LINKS.get(key.name),
      })));

      links.sort((a, b) => a.slug.localeCompare(b.slug));
      return json({ links });
    } catch (err) {
      return json({ error: err.message || 'Unable to list links.' }, 500);
    }
  }

  if (request.method === 'POST') {
    try {
      const { action, slug } = await request.json();

      if (action === 'delete') {
        if (!slug || !isValidSlug(slug)) return json({ error: 'Provide a valid slug to delete.' }, 400);
        await env.LINKS.delete(slug);
        return json({ success: true });
      }

      if (action === 'clear') {
        const keys = await listAllKeys(env.LINKS);
        let deletedCount = 0;

        for (const key of keys) {
          await env.LINKS.delete(key.name);
          deletedCount++;
        }

        return json({ success: true, count: deletedCount });
      }

      return json({ error: 'Invalid action.' }, 400);
    } catch (err) {
      return json({ error: err.message || 'Unable to update links.' }, 500);
    }
  }

  return json({ error: 'Method not allowed.' }, 405);
}
