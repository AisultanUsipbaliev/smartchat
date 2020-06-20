let SQL = require('../functions/query')

// Выборка

// Вставка
	exports.addFeedback = async function(student, comment, value) {
		let res = await SQL('insert into feedback(student, com, value) values (?,?,?)', [student, comment, value]);
		return res.affectedRows > 0 ? res.insertId: false; 
	}
// Удаление

// Изменение