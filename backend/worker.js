export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      const query = url.searchParams.get("query");
  
      if (!query) {
        return new Response("Query is required", { status: 400 });
      }
  
      try {
        const result = await env.DB.prepare(query).all();
        return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
    },
  };
  