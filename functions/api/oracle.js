export async function onRequestPost({ request, env }) {
  try {
    const { message } = await request.json();

    if (!env.AI) {
      return new Response(JSON.stringify({ error: "AI binding not configured in Cloudflare Pages." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const messages = [
      { 
        role: "system", 
        content: "You are 'The Oracle', an intelligent AI assistant hosted on soham.eu.cc, the personal website of the brilliant web developer Soham Dandekar. You serve as a highly capable, general conversational interface. Keep responses highly concise, extremely helpful, and accurate. Format code output gracefully if requested."
      },
      { role: "user", content: message }
    ];

    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', { messages });
    
    return new Response(JSON.stringify({ response: response.response }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "CRITICAL: Neural sync failure. Check connection parameters." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
