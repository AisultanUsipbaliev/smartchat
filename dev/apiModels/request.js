let SQL = require('../apiFunctions/query')

// select
	exports.getRequestTeacherId = async (student_id) => {
		return (await SQL('select teacher_id from req where student_id = ?', student_id))[0].teacher_id
	}
	
	exports.getMyReqs = async function(student) {
		return await SQL('select * from req where student_id = ?', student)
	}
// insert
	exports.addReq = async function(student_id, start_time, finish_time, nday, rate_id, teacher_id) {
		return (await SQL(`insert into req(student_id, start_time, finish_time, nday, rate_id, teacher_id) 
		values (?,?,?,?,?,?)`, [student_id, start_time, finish_time, nday, rate_id, teacher_id])).affectedRows
	}
// update

// delete
	exports.deleteMyReqs = async function(student) {
		return (await SQL('delete from req where student_id = ?', student)).affectedRows
	}