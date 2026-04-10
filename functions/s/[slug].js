export async function onRequestGet({ params, env }) {
  const { slug } = params;

  if (!env.LINKS) {
    return new Response('Redirection service not configured (KV binding missing).', { status: 500 });
  }

  const url = await env.LINKS.get(slug);

  if (url) {
    return Response.redirect(url, 302);
  }

  return new Response('Short URL not found.', { status: 404 });
}
