let sendSms 	= require('../../apiFunctions/smsApi'),
	sendMail 	= require('../../apiFunctions/mailing')

module.exports = async function(teacher, message) {
	await log('alertTeacher started')

	let data = {
		notice : 10, 
		msg: message
	}

	let delivered = false
	socket.clients.forEach(async (ws) => {
		if (ws.userid === 't' + teacher.teacher_id) {
			try {
				ws.send(JSON.stringify(data))
				delivered = true
				await log(`sended for teacher ${teacher.teacher_id}: ${teacher.email} by SOCKET: ${message}`)
			} catch(err) {
				await log('alertTeacher error' + err.message, {teacher}, 1)
				sayMe('alertTeacher socket', {}, err.message)
			}
		}
	})

	if(!delivered) {
		await sendMail(message, teacher)
		await log(`sended for teacher ${teacher.teacher_id}: ${teacher.email} by EMAIL: ${message}`)

		await sendSms(teacher.phone, message)
		await log(`sended for teacher ${teacher.teacher_id}: ${teacher.email} by SMS: ${message}`)
	}

	await log('alertTeacher completed')
	return delivered
}