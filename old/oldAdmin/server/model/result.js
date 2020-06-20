let SQL = require('../functions/query')

// Выборка
	exports.getMyResult = async function(myId, test) {
		return (await SQL('select * from result where student_id = ? and test_id = ?', [myId, test]))[0]
	}
// Вставка

// Удаление

// Изменение
	exports.addResult = async function(myId, test, count, answers) {
		return (await SQL('update result set count = ?, answers = ?, dt = now(), done=1 where student_id = ? and test_id = ?', [count, answers, myId, test])).affectedRows
	}