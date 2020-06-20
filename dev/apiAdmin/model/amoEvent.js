let SQL = require('../functions/query')

// Выборка
	exports.findTime = async function(utc) {
		return await SQL('select * from amoEvent where utc = ?', utc)
	}

// Вставка
	exports.add = async function(student, stage, utc) {
		return (await SQL('insert into amoEvent(student, stage, utc) values(?,?,?)', [student, stage, utc])).affectedRows>0
	}

// Удаление
	exports.delete = async function(id) {
		return (await SQL('delete from amoEvent where id = ?', id)).affectedRows>0
	}
	
// Изменение