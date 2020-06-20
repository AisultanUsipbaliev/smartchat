const SQL = require('../functions/query');

// Выборка
	
// Вставка
	exports.add = async function(isteacher, user, ip, agent) {
		return (await SQL('insert into ingress(isteacher, user, ip, agent) values (?, ?, ?, ?)', [isteacher, user, ip, agent])).affectedRows > 0
	}
// Изменение 

// Удаление