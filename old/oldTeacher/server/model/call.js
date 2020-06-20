let SQL = require('../functions/query')

// Выборка
	exports.getCall = async function() {
		return (await SQL('select * from phoneCall limit 1'))[0]
	}
// Вставка
	exports.addCall = async function(student, callType){
		return (await SQL('insert into phoneCall(student, callType) values (?,?)', [student,callType])).affectedRows>0?true:false
	}
// Удаление
	exports.deleteCall = async function(id) {
		return (await SQL('delete from phoneCall where id = ?', id)).affectedRows>0?true:false
	}
// Изменение