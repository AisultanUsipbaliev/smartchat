let SQL = require('../functions/query')

// Выборка

// Вставка
	exports.addReport = async function(id, comment, file) {
		if(file) return (await SQL('insert into report(user, com, file) values(?,?,?)', 
			[id, comment, file])).affectedRows>0
		else return (await SQL('insert into report(user, com) values(?,?)', 
			[id, comment])).affectedRows>0
	}
// Удаление

// Изменение