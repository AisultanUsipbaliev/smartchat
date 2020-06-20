let SQL = require('../apiFunctions/query')

// Выборка
	exports.getAll = async function() {
		return await SQL('select * from sertificat')
	}
	exports.findFile = async function(file) {
		return await SQL('select * from sertificat where filename = ?', file)
	}
	exports.getStudentSertificats = async function(myId) {
		return await SQL(`select s.id, s.student, s.rate, s.filename, s.dt, r.rate_name 
			from sertificat s 
			join rate r on r.rate_id = s.rate
			where student = ?`, myId)
	}
// Вставка
	exports.add = async function(studentId, rateId, filename) {
		return (await SQL('insert into sertificat(student, rate, filename) values (?,?,?)', [studentId, rateId, filename])).affectedRows
	}
// Удаление

// Изменение
