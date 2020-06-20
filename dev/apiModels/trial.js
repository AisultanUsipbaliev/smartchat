let SQL = require('../apiFunctions/query')

// Select
	exports.getTrials = async (studentId) => {
		return await SQL('select * from trial where student_id = ?', studentId)
	}
	exports.getTrial = async function(studentId) {
		return await SQL('select * from trial where student_id = ?', studentId)
	}
// Update

// Insert
	exports.addTrial = async function(teacher, studentId) {
		return	(await SQL('insert into trial(teacher_id, student_id) values (?,?)', [teacher, studentId])).affectedRows
	}
// Delete 
	