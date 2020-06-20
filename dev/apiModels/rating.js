let SQL = require('../apiFunctions/query')

// Выборка

// Вставка
	exports.addRating = async function(student, teacher, value, com){
		let res = await SQL('insert into rating(teacher_id, student_id, value, com) values(?,?,?,?)', [teacher, student, value, com])
		return res.affectedRows? res.insertId : false
	}
// Удаление

// Изменение