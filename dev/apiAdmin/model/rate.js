let SQL = require('../functions/query')

// Выборка
	exports.getRates = async function() {
		return await SQL('select * from rate where active = 1')
	}
	exports.getRate = async function(id) {
		return (await SQL('select * from rate where active = 1 and rate_id = ?', id))[0]
	}
// Вставка

// Удаление

// Изменение