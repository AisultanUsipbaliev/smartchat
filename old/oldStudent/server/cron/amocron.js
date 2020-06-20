let rDate 	= require('../functions/roundDate')
let nextDay = require('../functions/nextDate') 
let replacer 	 	= require('../functions/replacer')

let updateStage = require('../amocrm/updateDealStage')
let log = require('./log')

let mail 	= require('../functions/mailing')
let sms 	= require('../functions/smsApi')
let call 	= require('../functions/call')

let eventModel 		= require('../model/amoEvent')
let amocrmModel		= require('../model/amocrm')
let studentModel 	= require('../model/student')
let mailModel 		= require('../model/mail')

module.exports = async function() {
	let now = await rDate(0)
	let events = eventModel.findTime(now)
	let stages = config.amocrm

	for(let i=0; i<events.length; i++) {
		try {
			await eventModel.delete(event.id)
			
			let event 	= events[i]
			let student = await studentModel.getStudent(event.student)
			let deal 	= await amocrmModel.getStudentDeal(student.student_id)

			let packet 	= await mailModel.getMail(event.stage) 
			if(!packet) packet = {}
			let text 	= await replacer(packet.message, student.student_id)
			let smsText = await replacer(packet.sms, student.student_id)

			switch(event.stage) {
				case 0:
				if(deal.stage == stages.checkEnter) {
					mail( text , student )
					
					await eventModel.add(student.student_id, 1, await rDate(3))
					await log(`Отправлено 0 студенту ${student.student_id}`, deal)
				}
				break;
				case 1:
				if(deal.stage == stages.checkEnter){
					sms( student.phone, smsText )
					mail( text ,student)

					await eventModel.add(student.student_id, 2, await nextDay())
					await log(`Отправлено 1 студенту ${student.student_id}`, deal)
				}
				break;
				case 2:
				if(deal.stage == stages.checkEnter) {
					call(student.phone, 1, smsText)
					mail( text ,student)

					await eventModel.add(student.student_id, 11, await nextDay(3))
					await log(`Отправлено 2 студенту ${student.student_id}`, deal)
				}
				break;
				case 5:
				if(deal.stage == stages.checkTrial) {
					mail(text, student)

					await eventModel.add(student.student_id, 6, await rDate(3))
					await log(`Отправлено 5 студенту ${student.student_id}`, deal)
				}
				break;
				case 6:
				if(deal.stage == stages.checkTrial) {
					sms(student.phone, smsText)
					mail(text, student)
					
					await eventModel.add(student.student_id, 7, await nextDay())	
					await log(`Отправлено 6 студенту ${student.student_id}`, deal)
				}
				break;
				case 7:
				if(deal.stage == stages.checkTrial) {
					call(student.phone, 3, smsText)
					mail(text, student)
					
					await eventModel.add(student.student_id, 12, await nextDay(4))
					await log(`Отправлено 7 студенту ${student.student_id}`, deal)
				}
				break;
				case 11:
				if(deal.stage == stages.checkEnter) {
					await updateStage(deal.dealId, stages.leaved, stages.checkEnter)
					await log(`Студент #${student.student_id} свалил с 11 этапа`, deal)
				}
				break;
				case 12:
				if(deal.stage == stages.checkTrial) {
					await updateStage(deal.dealId, stages.leaved, stages.checkTrial)
					await log(`Студент #${student.student_id} свалил с 12 этапа`, deal)
				}
				break;
			}
		} catch(ex) {
			console.log(ex)
			sayMe('amocron ' + student.student_id, ex.message)
		}
	}
}