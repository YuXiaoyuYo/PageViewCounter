export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.origin !== 'https://yu.nm.cn') {
			return new Response('Forbidden', { status: 403 });
		}

		const { action, page } = await request.json();
		if (action === 'increment') {
			return await incrementCount(page, env);
		} else if (action === 'total') {
			return await getTotalCount(env);
		} else {
			return new Response('Method Not Allowed', { status: 405 });
		}
	}
}

async function incrementCount(page, env) {
	// 更新页面浏览量
	const updatePageQuery = `INSERT INTO views (page, count) VALUES (?, 1)
							 ON CONFLICT(page) DO UPDATE SET count = count + 1
							 RETURNING count`;
	const pageResult = await env.DB.prepare(updatePageQuery).bind(page).first();
	const pageCount = pageResult.count;
	return new Response(pageCount.toString(), { status: 200 });
}

async function getTotalCount(env) {
	// 获取并更新全站浏览量
	const updateTotalQuery = `UPDATE global_views SET total = total + 1 RETURNING total`;
	const totalResult = await env.DB.prepare(updateTotalQuery).first();
	const totalCount = totalResult.total;
	return new Response(totalCount.toString(), { status: 200 });
}
