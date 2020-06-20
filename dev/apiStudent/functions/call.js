let request 		= require('async-request')
let callModel 		= require('../../apiModels/phoneCall')
let studentModel	= require('../../apiModels/student')

let sms 			= require('./smsApi')

module.exports = async function(phone, code, mess) {

	if(!mess) mess = ''

	let now = new Date()
	let student = await studentModel.findPhone(phone)

	if(now.getHours() > 10 && now.getHours() < 22 ) {

		// console.log(`Совершен запрос на телефонию:\nТелефон: ${phone}\nКод: ${code}`)		
		// await request('http://voip.svo.kz:6666/call', {
		// 	method: 'POST', 
		// 	data: {
		// 		phone,
		// 		code
		// 	}
		// })

		if(mess.length) await sms(student.phone, mess)

	} else await callModel.addCall(student.student_id, code, mess)
}