let SQL = require('../functions/query')

// Выборка
	exports.getTeacher = async function(id) {
		return (await SQL('select * from teacher where teacher_id = ?', id))[0]
	}

	exports.findGroup = async function(group) {
		return (await SQL('select * from teacher where teacher_id in (select teacher_id from gr where group_id = ?)', group))[0]
	}

// Вставка

// Удаление

// Изменение