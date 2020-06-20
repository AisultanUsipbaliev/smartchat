let SQL = require('../functions/query')

// Выборка
	exports.getMyNotices = async function(myId) {
		return await SQL('select * from notice where user_id = ? and isteacher = 1 and deleted = 0', myId)
	}

	exports.getAllMyNotices = async function(myId) {
		return await SQL('select * from notice where user_id = ? and isteacher = 1', myId)
	}
// Вставка

// Удаление

// Изменение
	exports.deleteMyNotice = async function(myId, id) {
		return (await SQL('update notice set deleted = 0 where notice_id = ? and  user_id = ? and isteacher = 1', [id, myId])).affectedRows>0?true:false
	}
	exports.readMyNotices = async function(myId) {
		return (await SQL('update notice set isread = 1 where user_id = ? and isteacher = 1', myId)).affectedRows>0?true:false
	}