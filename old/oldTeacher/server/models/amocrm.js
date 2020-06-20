let SQL = require('../modules/query')

// Выборка
	exports.getDeal = async function(dealId) {
		return (await SQL('select * from amocrm where dealId = ?', dealId))[0]
	}
	exports.getStudentDeal = async function(student) {
		return (await SQL('select * from amocrm where student = ?', student))[0]
	}
// Вставка
	exports.addData = async function(student, dealId, contactId, stage, updated){
		return (await SQL('insert into amocrm(student, dealId, contactId, stage, updated) values(?,?,?,?, ?)', [student, dealId, contactId, stage, updated]))
		.affectedRows>0? true: false
	}
// Удаление

// Изменение
	exports.updateStage = async function(dealId, stage) {
		return (await SQL('update amocrm set stage = ? where dealId = ?', [stage, dealId]))
		.affectedRows>0? true: false
	}
	exports.updateDate = async function(dealId, updated) {
		return (await SQL('update amocrm set updated = ? where dealId = ?', [updated, dealId]))
		.affectedRows>0? true: false	
	}