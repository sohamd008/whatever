export async function onRequestPost({ request, env }) {
  try {
    const { url, slug } = await request.json();
    
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });
    }

    // Generate random slug if not provided
    const finalSlug = slug || Math.random().toString(36).substring(2, 8);

    // Check if LINKS KV exists
    if (!env.LINKS) {
      return new Response(JSON.stringify({ 
        error: 'Cloudflare KV namespace "LINKS" not found. Please bind it in your Pages settings.',
        slug: finalSlug // Return the slug anyway so the UI knows what would have been
      }), { status: 500 });
    }

    // Collision check
    const existing = await env.LINKS.get(finalSlug);
    if (existing) {
        return new Response(JSON.stringify({ error: "Slug already exists" }), { 
            status: 409, // Conflict
            headers: { "Content-Type": "application/json" } 
        });
    }

    // Store the link
    await env.LINKS.put(finalSlug, url);

    return new Response(JSON.stringify({ slug: finalSlug }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
