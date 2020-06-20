const faqModel = require('../../apiModels/faq');

exports.getFAQ = async function(req) {
	let faq = await faqModel.getStudentFAQ(req.body.myId)
	return {status: 200, faq}
}

exports.setFAQ = async function(req) {
	if(!req.body.id) 				return {status: 418, message: 'no id'}
	if(req.body.value == undefined)	return {status: 418, message: 'no value'}

	let seted = await faqModel.getStudentSet(req.body.id, req.body.myId)
	if(seted) return {status: 202, message: 'already seted'}

	if(req.body.value == 1) await faqModel.uppCounter(req.body.id)
	seted = await faqModel.setFaq(req.body.id, req.body.myId, req.body.value)
	
	if(seted) return {status: 200}
	else throw new Error('Can\'t set Faq')
}