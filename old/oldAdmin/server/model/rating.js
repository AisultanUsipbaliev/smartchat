let SQL = require('../functions/query')

// Выборка

// Вставка
	exports.addRating = async function(student, teacher, value, com){
		let res = await SQL('insert into rating(teacher_id, student_id, value, com) values(?,?,?,?)', 
			[teacher, student, value, com])
		return res.affectedRows>0?res.insertId:false
	}
// Удаление

// Изменение