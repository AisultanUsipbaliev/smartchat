let SQL = require('../functions/query')

// Выборка
	exports.getMyTrial = async function(student) {
		return await SQL('select * from trial where student_id = ?', student)
	}
// Вставка
	exports.addTrial = async function(teacher, student) {
		return	(await SQL('insert into trial(teacher_id, student_id) values (?,?)', [teacher, student]))
		.affectedRows > 0
	}
// Удаление

// Изменение