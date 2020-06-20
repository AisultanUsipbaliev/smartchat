let SQL = require('../functions/query')

// Выборка
	exports.getMyNF = async function(myId){
		return await SQL('select * from needFeedback where student = ?', myId)
	}
// Вставка

// Удаление
	exports.deleteMyNf = async function(myId, teacher){
		return (await SQL('delete from needFeedback where student = ? and teacher = ?', [myId, teacher])).affectedRows>0
	}
// Изменение