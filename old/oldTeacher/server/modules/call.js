let request 		= require('async-request')
let callModel 		= require('../model/call')
let studentModel	= require('../model/student')

let sms 			= require('./smsApi')

module.exports = async function(phone, code, mess) {

	if(!mess) mess = ''

	let now = new Date()
	let student = await studentModel.findPhone(phone)

	if(now.getHours() > 8 && now.getHours() < 22 ) {

		console.log(`Совершен запрос на телефонию:\nТелефон: ${phone}\nКод: ${code}`)		
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