let SQL = require('../functions/query')

// Выборка
	exports.getTeacher = async function(id) {
		return (await SQL('select * from teacher where teacher_id = ?', id))[0]
	}
	
	exports.getTeachers = async function() {
		return await SQL(`SELECT t.teacher_id, t.login, t.lastname, t.phone, t.email, t.lvl, t.ava, t.les_count, 
						(SELECT SUM( r.value)/COUNT(r.value) FROM rating r WHERE r.teacher_id = t.teacher_id) AS rating
						FROM teacher t
						where t.blocked = 0`)
	}

// Вставка

// Удаление

// Изменение