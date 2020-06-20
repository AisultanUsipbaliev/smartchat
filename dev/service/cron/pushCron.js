let push 		= require('../../apiFunctions/pushing'),
	replacer 	= require('../../apiFunctions/replacer')

let mailModel 		= require('../../apiModels/mail'),
	chartModel 		= require('../../apiModels/chart'),
	groupModel 		= require('../../apiModels/group'),
	teacherModel 	= require('../../apiModels/teacher'),
	studentModel	= require('../../apiModels/student')

module.exports = async function() {
	await log('function pushCron is started')
	
	let before 	= (new Date()).valueOf() 
	let after 	= before + 1000*60*20  // +20мин

	let groups = await chartModel.getBetweenStart(before, after)

	for(i=0; i<groups.length; i++) {
		try {
			let groupId = groups[i].group_id
			await log(`Work with group: ${groupId}`)
			let students = await studentModel.findGroup(groupId)

			for(i=0; i<students.length; i++) {
				let student = students[i]
				let pushes = JSON.parse(student.pushTokens)
				let packet 	= await mailModel.getMail(101) 
				let text 	= await replacer(packet.message, student.student_id)
				push(pushes, 'Уведомление', text, config.studentHostname + '/chat')
				await log(`sended for student #${student.student_id} PUSH:  ${text}`)
			}

		} catch(ex) {
			await log('pushCron error: ', {exeption: ex.message}, 1)
		}
	}
	await log('function pushCron is completed')
}