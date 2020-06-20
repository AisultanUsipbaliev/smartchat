let SQL = require('../functions/query')

// Выборка
	exports.getConfig = async function(){
		return (await SQL('select * from config'))[0]
	}
// Вставка

// Удаление

// Изменение