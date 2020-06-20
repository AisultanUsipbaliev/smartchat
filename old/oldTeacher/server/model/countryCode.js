let SQL = require('../functions/query')

// Выборка
	exports.getCodes = async function() {
		return await SQL('select * from countryCode order by name')
	}

// Вставка

// Удаление

// Изменение