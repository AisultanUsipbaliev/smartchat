let request = require('async-request')

module.exports = async function(route, method, data) {
	let auth = await request('https://start1t.amocrm.ru/private/api/auth.php', { method: 'POST',
		data: {
			USER_LOGIN: 'start1t@yandex.ru',
			USER_HASH: '1ffc47b61a65d1426699816d34934cd81d0b1864',
			type: 'json'
		}
	})

	return await request(route, {
		method, data,
		headers: {
			Cookie: auth.headers['set-cookie']
		}
	})
}