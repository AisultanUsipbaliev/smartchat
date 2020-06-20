let SQL = require('../functions/query')

// Выборка
	exports.getFAQ = async function() {
		return await SQL('select * from faq')
	}
// Вставка

// Удаление

// Изменение