export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.origin !== 'https://yu.nm.cn') {
			return new Response('Forbidden', { status: 403 });
		}

		if (request.method === 'POST') {
			const { action, page } = await request.json();
			if (action === 'increment') {
				return await incrementCount(page, env);
			} else if (action === 'total') {
				return await getTotalCount(env);
			}
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

async function getTotalCount(env) {
	const query = `SELECT SUM(count) as total FROM views`;
	const result = await env['DB'].prepare(query).first();
	const total = result.total;
	return new Response(total ? total.toString() : '0', { status: 200 });
}
