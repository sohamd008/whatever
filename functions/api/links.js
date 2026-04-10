export async function onRequest({ request, env }) {
  const authHeader = request.headers.get('x-terminal-auth');
  const serverPass = env.TERMINAL_PASS;

  if (!serverPass || authHeader !== serverPass) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Handle GET (List)
  if (request.method === 'GET') {
    try {
      const list = await env.LINKS.list();
      // Fetch values for each key to show destinations
      const links = await Promise.all(list.keys.map(async (k) => {
        const url = await env.LINKS.get(k.name);
        return { slug: k.name, url };
      }));
      return new Response(JSON.stringify({ links }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  // Handle DELETE
  if (request.method === 'POST') {
    try {
      const { action, slug } = await request.json();
      if (action === 'delete' && slug) {
        await env.LINKS.delete(slug);
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (action === 'clear') {
        let list = await env.LINKS.list();
        
        // Handle empty or missing keys gracefully
        if (!list.keys || list.keys.length === 0) {
          return new Response(JSON.stringify({ success: true, count: 0 }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Use sequential or chunked deletion to stay within sub-request limits (max 50)
        let deletedCount = 0;
        for (const k of list.keys) {
          await env.LINKS.delete(k.name);
          deletedCount++;
        }

        return new Response(JSON.stringify({ success: true, count: deletedCount }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}
