let SQL = require('../apiFunctions/query')

// select 
	exports.get = async (teacherId) => {
		return await SQL('select * from balance where teacher = ? order by 1 desc', [teacherId])
	}
	exports.getBetween = async (teacherId, start, finish) => {
		return await SQL(`select * from balance where teacher = ? and dt between str_to_date(?, '%Y-%m-%d %H:%i:%s') and str_to_date(?, '%Y-%m-%d %H:%i:%s') order by 1 desc`, [teacherId, start, finish])
	}
// insert
	exports.add = async (teacher, amount, comment) => {
		return (await SQL('insert into balance(teacher, amount, comment) values (?,?,?)', [teacher, amount, comment])).affectedRows
	}
// update

// delete 