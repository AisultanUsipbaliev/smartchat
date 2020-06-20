let SQL = require('../apiFunctions/query')

// Выборка
	exports.getCodes = async () => {
		return await SQL('select * from countryCode order by name')
	}

	exports.findCountry = async (part) => {
		return await SQL(`select * from countryCode where name like ? or code like ?`, [part, part])
	}

// Вставка

// Удаление

// Изменение