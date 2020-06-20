let request 		= require('async-request')
let sms 			= require('./smsApi')

module.exports = async function(phone, code, mess) {

	if(!mess) mess = ''
	// console.log(`Совершен запрос на телефонию:\nТелефон: ${phone}\nКод: ${code} Сообщение: ${mess}`)		

	// await request('http://voip.svo.kz:6666/call', {
	// 	method: 'POST', 
	// 	data: {
	// 		phone,
	// 		code
	// 	}
	// })

	if(mess.length) await sms(student.phone, mess)
}