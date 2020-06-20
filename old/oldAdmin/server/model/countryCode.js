let SQL = require('../functions/query')

// Выборка
	exports.getCodes = async function () {
		return await SQL('select * from countryCode order by name')
	}

	exports.findCountry = async function (part) {
		return await SQL(`select * from countryCode where name like '%${part}%' or code like '%${part}%'`)
	}

// Вставка

// Удаление

// Изменение