let call 			= require('../functions/call')
let sms 			= require('../functions/smsApi')
let mail 			= require('../functions/mailing')
let rDate			= require('../functions/roundDate')
let replacer 	 	= require('../functions/replacer')

let eventModel 		= require('../../apiModels/amoEvent')
let amocrmModel 	= require('../../apiModels/amocrm')
let studentModel 	= require('../../apiModels/student')
let mailModel 		= require('../../apiModels/mail')

module.exports = async function(req, res) {
	let dealId = req.body['leads[status][0][id]'] || req.body['leads[add][0][id]']
	try {

		let deal = await amocrmModel.getDeal(dealId)
		let student = await studentModel.getStudent(deal.student)

		await eventModel.add(student.student_id, 3, await rDate(6))

	} catch(ex) {

		sayMe('amoCheckEnter', {dealId, student}, ex.message + '')
		let dealId = req.body['leads[status][0][id]'] || req.body['leads[add][0][id]']
		console.log("dealId: ", dealId)
		console.log(ex)
	}
}