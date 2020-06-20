let needFeedbackModel = require('../../apiModels/needFeedback')

module.exports = async function(studentId, teacher) {
	await log('createFeedback started')

	let needFeedbackCreated = await needFeedbackModel.add(studentId, teacher.teacher_id)

	if(needFeedbackCreated) await log(`needFeedback is created for student #${studentId}`)
	else 					await log( 'needFeedback is not created', {}, 1 )
	
	socket.clients.forEach(async (ws)=> {
		if (ws.userid === 's' + studentId) {
			let data = {
				notice: 9,
				teacher: {
					id: teacher.teacher_id,
					firstname: teacher.login,
					lastname: teacher.lastname,
					ava: teacher.ava
				}
			}
			ws.send(JSON.stringify(data));
			await log(`SENDED FOR STUDENT ${studentId} DATA : `, data)
		}
	})

	await log('createFeedback finished')
}