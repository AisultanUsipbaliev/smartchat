let SQL = require('../functions/query')

// Выборка
	exports.getMyReqs = async function(student) {
		return await SQL('select * from req where student_id = ?', student)
	}
// Вставка
	exports.addReq = async function(student_id, start_time, finish_time, nday, rate_id, teacher_id) {
		return (await SQL(`insert into req(student_id, start_time, finish_time, nday, rate_id, teacher_id) 
		values (?,?,?,?,?,?)`, [student_id, start_time, finish_time, nday, rate_id, teacher_id])).affectedRows >0
	}
// Изменение

// Удаление
	exports.deleteMyReqs = async function(student) {
		return (await SQL('delete from req where student_id = ?', student)).affectedRows>0
	}