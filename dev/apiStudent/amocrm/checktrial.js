let call 			= require('../functions/call')
let sms 			= require('../functions/smsApi')
let mail 			= require('../functions/mailing')
let watsApp			= require('../functions/watsApp')
let rDate			= require('../functions/roundDate')
let nDate 			= require('../functions/nextDate')
let replacer 		= require('../functions/replacer')

let eventModel 		= require('../../apiModels/amoEvent')
let trialModel  	= require('../../apiModels/trial')
let amocrmModel 	= require('../../apiModels/amocrm')
let studentModel 	= require('../../apiModels/student')
let mailModel 		= require('../../apiModels/mail')

module.exports = async function(req, res) {
	let dealId = req.body['leads[status][0][id]'] || req.body['leads[add][0][id]']
	try {

	 	let deal = await amocrmModel.getDeal(dealId)
	 	if(!deal) throw Error('no deal')

		let student = await studentModel.getStudent(deal.student)
		let trials = await trialModel.getMyTrial(student.student_id)

		let mailText 	= await replacer((await mailModel.getMail(7)).message, student.student_id)	
		let smsText 	= await replacer((await mailModel.getMail(8)).message, student.student_id)
		let waText 		= await replacer((await mailModel.getMail(9)).message, student.student_id)

		if(trials.length == 0 && deal.stage == config.amocrm.checkTrial) {
			
			sms(student.pone, smsText)
			mail(mailText, student)
			watsApp(student.pone, waText)

			await eventModel.add(student.student_id, 10, await nDate())
		}

	} catch(ex) {
		sayMe('amoCheckTrial', {dealId}, ex.message + '')
		console.log("dealId: ", dealId)
		console.log(ex)
	}
}