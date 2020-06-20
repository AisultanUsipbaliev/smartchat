let SQL = require('../apiFunctions/query')

// Выборка
	exports.getMail = async function(stage) {
		return (await SQL('select * from mail where stage = ?', [stage]))[0]
	}
	exports.getAll = async function() {
		return await SQL('select * from mail')
	}
// Вставка

// Удаление

// Изменение
	exports.updateMail = async (id, message) => {
		return (await SQL('update mail set message = ? where id = ?', [message, id])).affectedRows
	}

