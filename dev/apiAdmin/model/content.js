let SQL = require('../functions/query')

// Выборка
	exports.getContents = async function(template) {
		return await SQL('select * from content where temp_id = ?', template)
	}
// Вставка

// Удаление

// Изменение