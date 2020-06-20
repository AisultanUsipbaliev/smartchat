let call 			= require('../functions/call')

let amocrmModel 	= require('../../apiModels/amocrm')
let studentModel 	= require('../../apiModels/student')

module.exports = async function(req, res) {
	try {
		let dealId = req.body['leads[status][0][id]'] || req.body['leads[add][0][id]']

	 	let deal = await amocrmModel.getDeal(dealId)
	 	if(!deal) throw Error('no deal')
		let student = await studentModel.getStudent(deal.student)
		
		call(student.phone, 9)

	} catch(ex) {
		sayMe('amo wasted', {dealId}, ex.message)
		let dealId = req.body['leads[status][0][id]'] || req.body['leads[add][0][id]']
		console.log("dealId: ", dealId)
		console.log(ex)
	}
}