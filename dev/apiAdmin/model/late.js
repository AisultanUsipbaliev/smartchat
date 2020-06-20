let SQL = require('../functions/query')

// Выборка
	exports.getMyLates = async function(myId) {
		return await SQL('select * from late where isteacher = 0 and user_id = ?', myId)
	}

	exports.getLateStudents = async function(hr) {
		return await SQL('select user_id id from late where isteacher = 0 and hr = ?', hr)
	}
// Вставка

// Удаление
	exports.deleteMyLates = async function(myId) {
		return (await SQL('delete from late where isteacher = 0 and user_id = ?', myId)).affectedRows>0
	}
// Изменение