let call 			= require('../functions/call')
let sms 			= require('../functions/smsApi')
let mail 			= require('../functions/mailing')
let rDate			= require('../functions/roundDate')
let replacer 		= require('../functions/replacer')

let eventModel 		= require('../model/amoEvent')
let trialModel  	= require('../model/trial')
let amocrmModel 	= require('../model/amocrm')
let studentModel 	= require('../model/student')
let mailModel 		= require('../model/mail')

module.exports = async function(req, res) {
	let dealId = req.body['leads[status][0][id]'] || req.body['leads[add][0][id]']
	try {


	 	let deal = await amocrmModel.getDeal(dealId)
	 	if(!deal) throw Error('no deal')

		let student = await studentModel.getStudent(deal.student)
		let trials = await trialModel.getMyTrial(student.student_id)

		let packet = await mailModel.getMail(101)
		if(!packet) packet = {}

		let text 	= await replacer(packet.message, student.student_id)	
		let smsText = await replacer(packet.sms, student.student_id)

		if(trials.length == 0 && deal.stage == config.amocrm.checkTrial) {
			await call(student.phone, 2, smsText)
			mail(text, student)
		
			await eventModel.add(student.student_id, 5, await rDate(1))
		}

	} catch(ex) {
		sayMe('amoCheckTrial', {dealId}, ex.message + '')
		console.log("dealId: ", dealId)
		console.log(ex)
	}
}