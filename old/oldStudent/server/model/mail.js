let SQL = require('../functions/query')

// Выборка
	exports.getMail = async function(stage) {
		return (await SQL('select * from mail where stage = ?', stage))[0]
	}

	exports.getAll = async function() {
		return await SQL('select * from mail')
	}
// Вставка

// Удаление

// Изменение
