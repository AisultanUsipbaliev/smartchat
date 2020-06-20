let rDate 		= require('../../apiFunctions/roundDate')
let nextDay 	= require('../../apiFunctions/nextDate') 
let replacer 	= require('../../apiFunctions/replacer')
let updateStage = require('../../apiFunctions/updateDealStage')
let mail 		= require('../../apiFunctions/mailing')
let sms 		= require('../../apiFunctions/smsApi')
let call 		= require('../../apiFunctions/call')
let watsApp 	= require('../../apiFunctions/watsApp')

let eventModel 		= require('../../apiModels/amoEvent'),
	amocrmModel		= require('../../apiModels/amocrm'),
	studentModel 	= require('../../apiModels/student'),
	mailModel 		= require('../../apiModels/mail')

module.exports = async function() {
	let now = await rDate(0)
	let events = eventModel.findTime(now)
	let stages = config.amocrm

	for(let i=0; i<events.length; i++) {
		let event 	= events[i]
		try {
			await eventModel.delete(event.id)
			
			let student = await studentModel.getStudent(event.student)
			if(!student) throw new Error('no student')
			let deal 	= await amocrmModel.getStudentDeal(student.student_id)
			if(!deal) throw new Error('no deal')
			
			let packet 	= await mailModel.getMail(event.stage) 
			if(!packet) packet = { message: '${toweb}' }

			let text = await replacer(packet.message, student.student_id)
			
			switch(event.stage) {
				case 3:
					if(deal.stage == stages.checkEnter) {
						mail(text, student)
						eventModel.add(student.student_id, 4, await nextDay())
					}
				break;

				case 4:
					if(deal.stage == stages.checkEnter) {
						mail(text, student)
						eventModel.add(student.student_id, 5, await nextDay(2))	
					} 
				break;

				case 5:
					if(deal.stage == stages.checkEnter) {
						mail(text, student)
						eventModel.add(student.student_id, 6, await nextDay(7))	
					} 
				break;

				case 6:
					if(deal.stage == stages.checkEnter) {
						mail(text, student)
						eventModel.add(student.student_id, 12, await nextDay())		
					} 
				break;

				case 10:
					if(deal.stage == stages.checkTrial) {
						call(student.phone, packet.call, text)
						eventModel.add(student.student_id, 11, await nextDay())		
					}
				break;

				case 11: 
					if(deal.stage == stages.checkTrial) {
						mail(text, student)
						eventModel.add(student.student_id, 13, await nextDay())
					}
				break;

				case 12:
				 	if(deal.stage == stages.checkEnter) 
				 		updateStage(deal.dealId, stages.leaved, stages.checkEnter)
				break;

				case 13:
				 	if(deal.stage == stages.checkTrial) 
				 		updateStage(deal.dealId, stages.leaved, stages.checkEnter)
				break;

				default: throw new Error('wrong stage')

			}

			await log(`Отправлено ${event.stage} студенту ${student.student_id}`, deal)

		} catch(ex) {
			console.log(ex)
			await log('amocron error: '+ex.message, {event}, 1)
			sayMe('amocron ' + student.student_id, {event}, ex.message)
		}
	}
}