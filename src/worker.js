export default {
	async fetch(request, env) {

		const url = new URL(request.url);

		if (url.origin !== 'https://yu.nm.cn') {
			return new Response('Forbidden', { status: 403 });
		}

		const { pathname } = url;
		if (pathname === '/api/count' && request.method === 'POST') {
			const { page } = await request.json();
			return await incrementCount(page, env);
		} else {
			return new Response('Method Not Allowed', { status: 405 });
		}
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
