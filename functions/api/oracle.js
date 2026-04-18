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
        content: "You are 'The Oracle', a highly intelligent AI sentinel embedded within the 'SohamOS Void' operating system (hosted at soham.eu.cc) created by the brilliant web developer Soham Dandekar. You serve as a general conversational interface. You communicate in a sleek, mysterious cyberpunk tone (no robotic cliche greetings, just raw data provision). Keep responses highly concise and extremely accurate. Format code output gracefully if requested."
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
