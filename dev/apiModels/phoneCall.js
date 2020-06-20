let SQL = require('../apiFunctions/query')

// Выборка
	exports.getCall = async function() {
		return (await SQL('select * from phoneCall limit 1'))[0]
	}
// Вставка
	exports.addCall = async function(studentId, callType, mess){
		return (await SQL('insert into phoneCall(student, callType, mess) values (?,?,?)', [studentId,callType,mess])).affectedRows
	}
// Удаление
	exports.deleteCall = async function(id) {
		return (await SQL('delete from phoneCall where id = ?', [id])).affectedRows
	} 
// Изменение