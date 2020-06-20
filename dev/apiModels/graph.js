let SQL = require('../apiFunctions/query')

// select 
	exports.getGraph = async (teacherId) => {
		return await SQL('select * from graph where teacher_id = ? order by nday', [teacherId])
	}

// insert
	exports.createGraph = async (teacherId, startTime, finishTime, nday) => {
		return (await SQL(' insert into graph(teacher_id, start_time, finish_time, nday) values (?,?,?,?)',
							[teacherId, startTime, finishTime, nday])).insertId
	}

// update

// delete
	exports.deleteGraph = async (teacherId) => {
		return (await SQL('delete from graph where teacher_id = ?', [teacherId])).affectedRows
	} 