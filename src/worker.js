export default {
	async fetch(request, env) {
	  const url = new URL(request.url);
	  const page = url.searchParams.get('page');
	  if (url.pathname === '/api/count' && request.method === 'POST') {
		  return await incrementCount(page, env);
	  }
	  return new Response('Invalid Request', { status: 400 });
	}
  }
  
  async function incrementCount(page, env) {
	const query = `INSERT INTO views (page, count) VALUES (?, 1)
				   ON CONFLICT(page) DO UPDATE SET count = count + 1
				   RETURNING count`;
	const result = await env['DB'].prepare(query).bind(page).first();
	const count = result.count;
	return new Response(count.toString(), { status: 200 });
  }
  