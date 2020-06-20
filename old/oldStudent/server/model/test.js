let SQL = require('../functions/query')

// Выборка
	exports.getTest = async function(id) {
		return await SQL('select * from test where test_id = ?', id)
	}
	exports.getMyTests = async function(myId) {
		return await SQL(`select t.test_id, t.test_name, t.teacher_id, l.lvl_id, 
			l.lvl_name, r.count, r.isread, r.dt, r.answers
			from test t
			join lvl l on l.lvl_id = t.test_lvl
			left join result r on r.test_id = t.test_id
			where r.student_id = ?`, myId)
	}
	exports.getMyTest = async function(myId, id) {
		return (await SQL('select * from test t join result r on r.test_id = t.test_id join lvl l on l.lvl_id = t.test_lvl where t.test_id = ? and r.student_id = ?', [id, myId]))[0]
	}
	exports.getMyTestsCount = async function(myId) {
		return (await SQL('select count(*) cnt from result where student_id = ? and done = 0', myId))[0].cnt
	}
// Вставка

// Удаление

// Изменение