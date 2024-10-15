export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.origin !== 'https://yu.nm.cn') {
			return new Response('Forbidden', { status: 403 });
		}

		const { action } = await request.json();
		if (action === 'total') {
			return await getTotalCount(env);
		} else {
			return new Response('Method Not Allowed', { status: 405 });
		}
	}
}

async function getTotalCount(env) {
	// 获取并更新全站浏览量
	const updateTotalQuery = `UPDATE global_views SET total = total + 1 RETURNING total`;
	const totalResult = await env['DB'].prepare(updateTotalQuery).first();
	const totalCount = totalResult.total;
	return new Response(totalCount.toString(), { status: 200 });
}
