let SQL = require('../apiFunctions/query')

// select
	exports.findTime = async (utc) =>  {
		return await SQL('select * from amoEvent where utc = ?', [utc])
	}
// insert
	exports.add = async (studentId, stage, utc) => {
		return (await SQL('insert into amoEvent(student, stage, utc) values(?,?,?)', [studentId, stage, utc])).affectedRows
	}
// update

// delete
	exports.delete = async (id) => {
		return (await SQL('delete from amoEvent where id = ?', [id])).affectedRows
	}
	