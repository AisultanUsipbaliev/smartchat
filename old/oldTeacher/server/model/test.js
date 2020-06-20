let SQL = require('../functions/query')

// Выборка
	exports.getTest = async function(id) {
		return await SQL('select * from test where test_id = ?', id)
	}
// Вставка

// Удаление

// Изменение