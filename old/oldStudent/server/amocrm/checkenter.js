let call 			= require('../functions/call')
let sms 			= require('../functions/smsApi')
let mail 			= require('../functions/mailing')
let rDate			= require('../functions/roundDate')
let replacer 	 	= require('../functions/replacer')

let eventModel 		= require('../model/amoEvent')
let amocrmModel 	= require('../model/amocrm')
let studentModel 	= require('../model/student')
let mailModel 		= require('../model/mail')

module.exports = async function(req, res) {
	let dealId = req.body['leads[status][0][id]'] || req.body['leads[add][0][id]']
	try {

		let deal = await amocrmModel.getDeal(dealId)
		let student = await studentModel.getStudent(deal.student)
				
		let packet = await mailModel.getMail(100)
		if(!packet) packet = {}

		let text 	= await replacer(packet.message, student.student_id)	
		let smsText = await replacer(packet.sms, student.student_id)

		if(!student.guideUsed && deal.stage == config.amocrm.checkEnter) {
			await call(student.phone, 8, smsText)
			mail(text, student)
			
			await eventModel.add(student.student_id, 0, await rDate(2))
		}
	} catch(ex) {

		sayMe('amoCheckEnter', {dealId, student}, ex.message + '')
		let dealId = req.body['leads[status][0][id]'] || req.body['leads[add][0][id]']
		console.log("dealId: ", dealId)
		console.log(ex)
	}
}