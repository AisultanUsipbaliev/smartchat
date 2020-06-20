let SQL = require('../apiFunctions/query')

// select
	exports.getLates = async (userId, isteacher) => {
		return await SQL('select * from late where user_id = ? and isteacher = ?', [userId, isteacher])
	}
	exports.getStudentLates = async function(studentId) {
		return await SQL('select * from late where isteacher = 0 and user_id = ?', [studentId])
	}
	exports.getTeacherLates = async (teacherId) => {
		return await SQL('select * from late where isteacher = 1 and user_id = ?', [teacherId])
	}
	exports.getLateStudents = async function(hr) {
		return await SQL('select user_id id from late where isteacher = 0 and hr = ?', [hr])
	}
	
// insert
	exports.add = async (userId, isteacher, groupId, now) => {
		return (await SQL('insert into late(user_id, isteacher, group_id, hr) values (?, ?, ?, ?)', [userId, isteacher, groupId, now])).affectedRows
	}

// delete
	exports.deleteLates = async (userId, isteacher) => {
		return (await SQL('delete from late where user_id = ? and isteacher = ?', [userId, isteacher])).affectedRows
	}
	exports.deleteStudentLates = async function(studentId) {
		return (await SQL('delete from late where isteacher = 0 and user_id = ?', [studentId])).affectedRows
	}

	exports.deleteTeacherLates = async function(teacherId) {
		return (await SQL('delete from late where isteacher = 1 and user_id = ?', [teacherId])).affectedRows
	}
// update 