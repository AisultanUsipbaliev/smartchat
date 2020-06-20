let replacer	= require('../../apiFunctions/replacer'),
	mail 		= require('../../apiFunctions/mailing')

let alertTeacher = require('../functions/alertTeacher') 	// teacher, message

let chartModel 		= require('../../apiModels/chart'),
	mailModel 		= require('../../apiModels/mail'),
	groupModel		= require('../../apiModels/group'),
	studentModel	= require('../../apiModels/student'),
	teacherModel 	= require('../../apiModels/teacher')

module.exports = async function() {
	await log('function mailCron started')

	let before 	= (new Date()).valueOf()
	let after 	= before + 1000*60*30 // +30мин
	let groups = await chartModel.getBetweenStart(before, after)
	
	for(let i = 0; i<groups.length; i++) {
		try {
			let groupId = groups[i].group_id
			await log(`Work with group: ${groupId}`)
			
			let group 		= await groupModel.getGroup(groupId)
			let students 	= await studentModel.findGroup(groupId)
			let teacher		= await teacherModel.findGroup(groupId)
			
			await alertTeacher(teacher, `Через 15 минут у вас занятие с ${group.group_name}`)

			for(let j = 0; j<students.length; j++) {
				let student = students[j]
				let packet 	= await mailModel.getMail(100) 
				let text 	= await replacer(packet.message, student.student_id)
				mail(text, student)
				await log(`sended for student #${student.student_id} MAIL:  ${text}`)
			}
			
			await log(`Work with group:#${groupId} is completed`)
		
		} catch(ex) {
			await log('mailCron error: ', {exeption: ex.message}, 1)
			sayMe('mailCron', {}, ex.message)
		}
	}
	await log('function mailCron is completed')
}