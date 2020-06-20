let sms 			= require('../functions/smsApi')
let mail 			= require('../functions/mailing')
let watsApp 		= require('../functions/watsApp')
let getHash 		= require('../functions/getHash')
let replacer 	 	= require('../functions/replacer')
let generateId		= require('../functions/generateId')

let getDeal 		= require('./getDeal')
let getContact 		= require('./getContact')
let updateDealStage = require('./updateDealStage')

let amocrmModel 	= require('../../apiModels/amocrm')
let studentModel 	= require('../../apiModels/student')
let mailModel 		= require('../../apiModels/mail')

module.exports = async function(req, res) {
	let dealId = req.body['leads[status][0][id]'] || req.body['leads[add][0][id]']
	try {
		console.log('amoreg started')
		console.log('dealId: ', dealId)
		let deal = await getDeal(dealId)
		console.log('contactId: ', deal.contactId)
		let contact = await getContact(deal.contactId)
		console.log('phone: ', contact.phone)

		let student = await studentModel.findPhone(contact.phone)
		let hash = await getHash('smartchat')
		let code = (await generateId(5)) + '1'

		let studentId = 0

		if(!student) {

			studentId = await studentModel.addStudent(contact.phone, hash, contact.firstname)
			student = await studentModel.getStudent(studentId)
			writeAction(`Новый студент ${contact.firstname} (${contact.phone}) с AMOCRM`)
			
		} else {

			studentId = student.student_id
			writeAction(`Уже зарегестрированный студент ${student.firstname} (${contact.phone}) с AMOCRM`)
		
		}

		if(contact.email) await studentModel.updateEmail(studentId, contact.email)

		await studentModel.updateGuide(studentId, code)
		await studentModel.activatePhone(studentId)

		let text = await replacer((await mailModel.getMail(1)).message, studentId)	
		sms(contact.phone, text)

		text = await replacer((await mailModel.getMail(2)).message, studentId)
		watsApp(contact.phone, text)

		await amocrmModel.addData(studentId, dealId, deal.contactId, 0, deal.updated)
		let updated = await updateDealStage(dealId, config.amocrm.checkEnter, 0)
		if(!updated) console.log('wrong stages')

		console.log('amoreg completed')
	} catch(ex) {
		sayMe('amoreg', {dealId}, ex.message + '')		
		console.log("dealId: ", dealId)
		console.log(ex)
	}
}