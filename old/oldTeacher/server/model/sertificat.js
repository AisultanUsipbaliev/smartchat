let SQL = require('../functions/query')

// Выборка
	exports.getAll = async function() {
		return await SQL('select * from sertificat')
	}
// Вставка
	exports.add = async function(studentId, rateId, filename) {
		return (await SQL('insert into sertificat(student, rate, filename) values (?,?,?)', [studentId, rateId, filename])).affectedRows>0
	}
// Удаление

// Изменение