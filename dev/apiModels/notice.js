let SQL = require('../apiFunctions/query')

// Select
	exports.getTeacherNotices = async (teacherId) => {
		return await SQL(`select * from notice where user_id = ? and isteacher = 1 and deleted = 0 order by dt desc`, [teacherId])
	}
	exports.getStudentNotices = async function(studentId) {
		return await SQL('select * from notice where user_id = ? and isteacher = 0 and deleted = 0 order by dt desc', [studentId])
	}
// Update
	exports.readTeacherNotices = async (teacherId) => {
		return (await SQL('update notice set isread = 1 where user_id = ? and isteacher = 1', [teacherId])).affectedRows
	}
	exports.readStudentNotices = async function(studentId) {
		return (await SQL('update notice set isread = 1 where user_id = ? and isteacher = 0', [studentId])).affectedRows
	}

// Insert
	exports.add = async (userId, isteacher, content) => {
		return (await SQL('insert into notice(user_id, isteacher, content) values (?, ?, ?)', [userId, isteacher, content])).insertId
	}
	exports.write = async (userId, isteacher, content, link) => {
		return (await SQL('insert into notice(user_id, isteacher, content, link) values (?, ?, ?, ?)', [userId, isteacher, content, link])).insertId
	}
// Delete
	exports.delete = async (userId, id, isteacher) => {
		return (await SQL('update notice set deleted = 1 where user_id = ? and isteacher = ? and notice_id = ?', [userId, isteacher, id])).affectedRows
	}