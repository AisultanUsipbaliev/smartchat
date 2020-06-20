let SQL = require('../apiFunctions/query')

// Select
	exports.getNotSended = async () => {
		return await SQL('select * from trialReport where sended = 0')
	}
// Update
	exports.setSended = async (id) => {
		return (await SQL('update trialReport set sended = 1 where id = ?', [id])).affectedRows
	}
// Insert
	exports.add = async (studentId, content) => {
		return (await SQL('insert into trialReport(student, content) values (?,?)', [studentId, content])).affectedRows
	}
// Delete 