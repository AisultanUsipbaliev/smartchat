let updateDealStage = require('./updateDealStage')

let amocrmModel 	= require('../model/amocrm')
let studentModel 	= require('../model/student')


module.exports = async function(req, res) {
	if(!req.query.result) 	return res.sendStatus(418)
	if(!req.query.phone) 	return res.sendStatus(418)

	console.log(req.query)

	let student = await studentModel.findPhone(req.query.phone)
	if(!student) {
		console.log('student not found')
		return res.status(400).json({ok:false})
	}

	console.log(student)

	let deal = await amocrmModel.getStudentDeal(student.student_id)
	if(!deal) {
		console.log('deal not found')
		return res.status(400).json({ok:false})
	}

	console.log(deal)

	let result = req.query.result? config.amocrm.checkTrial: config.amocrm.leaved
	await updateDealStage(deal.dealId, result, config.amocrm.wasted)
	res.status(200).json({ok:true})
}
 // { '{"result":"1", "phone":" 77785018622"}': '' }