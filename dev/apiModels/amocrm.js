let SQL = require('../apiFunctions/query')

// select
	exports.getDeal = async (dealId) => {
		return (await SQL('select * from amocrm where dealId = ?', [dealId]))[0]
	}
	exports.getStudentDeal = async (studentId) => {
		return (await SQL('select * from amocrm where student = ?', [studentId]))[0]
	}
// insert
	exports.addData = async (studentId, dealId, contactId, stage, updated) => {
		return (await SQL('insert into amocrm(student, dealId, contactId, stage, updated) values(?,?,?,?,?)', [studentId, dealId, contactId, stage, updated])).affectedRows
	}
// update
	exports.updateStage = async (dealId, stage) => {
		return (await SQL('update amocrm set stage = ? where dealId = ?', [stage, dealId])).affectedRows
	}
	exports.updateDate = async (dealId, updated) => {
		return (await SQL('update amocrm set updated = ? where dealId = ?', [updated, dealId])).affectedRows	
	}
// delete