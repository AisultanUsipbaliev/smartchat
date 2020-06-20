let SQL = require('../apiFunctions/query')

// Выборка
	exports.getStudentFAQ = async function(studentId) {
		return await SQL(`select f.id, f.question, f.answer, f.counter, if(sf.faq, true, false) mark
			from faq f left join studentFaq sf on sf.faq = f.id and sf.student = ?`, [studentId])
	}
	exports.getStudentSet = async function(id, studentId) {
		return (await SQL('select * from studentFaq where faq = ? and student = ?', [id, studentId]))[0]
	}
// Вставка
	exports.setFaq = async function(id, studentId, val) {
		return (await SQL('insert into studentFaq(faq, student, val) values (?,?,?)', [id, studentId, val])).affectedRows
	}
// Удаление

// Изменение
	exports.uppCounter = async function(id) {
		return (await SQL('update faq set counter = counter + 1 where id = ?', [id])).affectedRows
	}