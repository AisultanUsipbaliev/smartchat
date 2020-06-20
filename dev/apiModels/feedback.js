let SQL = require('../apiFunctions/query')

// Выборка

// Вставка
	exports.addFeedback = async function(student, comment, value) {
		let res = await SQL('insert into feedback(student, com, value) values (?,?,?)', [student, comment, value])
		return res.affectedRows? res.insertId: false
	}
// Удаление

// Изменени