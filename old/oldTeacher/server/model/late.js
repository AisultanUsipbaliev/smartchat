let SQL = require('../functions/query')

// Выборка
	exports.getMyLates = async function(myId) {
		return await SQL('select * from late where isteacher = 1 and user_id = ?', myId)
	}
// Вставка
	exports.addLate = async function(user, isteacher, group, now) {
		return (await SQL('insert into late(user_id, isteacher, group_id, hr) values (?, 1, ?, ?)', [user, isteacher, group, now])).affectedRows>0?true:false
	}
// Удаление
	exports.deleteMyLates = async function(myId) {
		return (await SQL('delete from late where isteacher = 1 and user_id = ?', myId)).affectedRows>0?true:false
	}
// Изменение