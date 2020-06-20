let SQL = require('../functions/query')

// Выборка
	exports.getMyFAQ = async function(student) {
		return await SQL(`select f.id, f.question, f.answer, f.counter, if(sf.faq, true, false) mark
			from faq f left join studentFaq sf on sf.faq = f.id and sf.student = ?`, student)
	}
	exports.getMySet = async function(id, student) {
		return (await SQL('select * from studentFaq where faq = ? and student = ?', [id, student]))[0]
	}
// Вставка
	exports.setFaq = async function(id, student, val) {
		return (await SQL('insert into studentFaq(faq, student, val) values (?,?,?)', [id, student, val])).affectedRows>0
	}
// Удаление

// Изменение
	exports.uppCounter = async function(id) {
		return (await SQL('update faq set counter = counter + 1 where id = ?', id)).affectedRows>0
	}