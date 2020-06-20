let SQL = require('../apiFunctions/query')

// Выборка
	
// Вставка
	exports.get = async (type) => {
		return (await SQL('select * from implementation where type = ?', type))[0]
	}
// Изменение 

// Удаление