let callModel		= require('../model/call')
let studentModel 	= require('../model/student')
let amocrmModel 	= require('../model/amocrm')

let call = require('../functions/call')
let sms  = require('../functions/smsApi')

module.exports = async function() {

	let phoneCall = await callModel.getCall()

	if(phoneCall) {
		let student = await studentModel.getStudent(phoneCall.student)

		let deal = await amocrmModel.getStudentDeal(student.student_id)
		if(!deal) { 
			await callModel.deleteCall(phoneCall.id)
			await call(student.phone, phoneCall.callType, phoneCall.mess)
			throw new Error(`Студент есть #${student.student_id}, сделки нет ${deal}!`) 
		}
		let stage = null
		
		switch(phoneCall.callType) {
			case 1: stage = config.amocrm.checkEnter; break;
			case 2: stage = config.amocrm.checkTrial; break;
		}

		if(stage == deal.stage) await call(student.phone, phoneCall.callType, phoneCall.mess)
		
		await callModel.deleteCall(phoneCall.id)
	}
}