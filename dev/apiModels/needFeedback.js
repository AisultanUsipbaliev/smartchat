let SQL = require('../apiFunctions/query')

// select
	exports.get = async function(studentId){
		return await SQL(`
			select nf.id, nf.student, nf.teacher, t.login firstname, t.lastname, t.ava 
			from needFeedback nf 
			left join teacher t on nf.teacher = t.teacher_id
			where student = ?`, [studentId])
	}
// insert
	exports.add = async function(studentId, teacherId) {
		return (await SQL(`insert into needFeedback(student, teacher) values (?,?),(?,0)`, [studentId, teacherId, studentId])).affectedRows
	}
// delete
	exports.delete = async function(studentId, teacherId){
		return (await SQL('delete from needFeedback where student = ? and teacher = ?', [studentId, teacherId])).affectedRows
	}

// update