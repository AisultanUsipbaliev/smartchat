let sendSms 	= require('../../apiFunctions/smsApi'),
	sendMail 	= require('../../apiFunctions/mailing'),
	sendPush 	= require('../../apiFunctions/pushing')

module.exports = async function(student, message, sms) {
	await log('alertStudent started')

	let data = { notice: 10, msg: message}
	let delivered = false

	socket.clients.forEach(async (ws) => {
		if (ws.userid === 's' + student.student_id) {
			try {
				
				ws.send(JSON.stringify(data))
				delivered = true
				await log(`Sended for student ${student.student_id}: ${student.firstname} ${student.lastname} by SOCKET: ${message}`)
			
			} catch(err) {
				sayMe('alertStudent socket', {}, err.message)
				await log(`alertStudent socket: ${err.message}`, {}, 1)
			}
		}
	})

	// if(!delivered) {
	// 	student.pushTokens = JSON.parse(student.pushTokens)
	// 	if(student.pushTokens.length) {
	// 		await sendPush(student.pushTokens, 'Уведомление', message)
	// 		await log(`Sended for student ${student.student_id}: ${student.firstname} ${student.lastname} by PUSH: ${message}`)
	// 	}
	// }

	if(sms) {
		await sendSms(student.phone, sms)
		await log(`Sended for student ${student.student_id}: ${student.firstname} ${student.lastname} by SMS: ${sms}`)
	}
	// if(student.mailOn && student.email) {
	// 	await sendMail(message, student)
	// 	await log(`Sended for student ${student.student_id}: ${student.firstname} ${student.lastname} by MAIL: ${message}`)
	// }
	
	await log('alertStudent completed')
	return delivered
}