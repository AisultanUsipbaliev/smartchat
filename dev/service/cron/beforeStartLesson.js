let axios = require('axios')

let alertStudent	= require('../functions/alertStudent'), 	// student, message, sms	
	alertTeacher 	= require('../functions/alertTeacher')		// teacher, message

let chartModel 		= require('../../apiModels/chart'),
	studentModel 	= require('../../apiModels/student'),
	groupModel 		= require('../../apiModels/group'),
	teacherModel 	= require('../../apiModels/teacher')

module.exports = async function() {
	await log('function beforeStartLesson started')
	
	let before 	= (new Date()).valueOf() + 1000 * 60 * 32 // +32 мин
	let after 	= before + 1000 * 60 * 32 // + 32 мин
	
	let groups = await chartModel.getBetweenStart(before, after)
	if(groups.length) 	await log('AFTER 1 HOUR LESSONS WILL START FOR: ', groups)
	else 				await log('NO LESSONS AFTER 1 HOUR')
	
	for(i=0; i<groups.length; i++) {
		try {
			let groupId = groups[i].group_id
			await log(`Work with group: #${groupId}`)

			let students 	= await studentModel.findGroup(groupId)
			let group 		= await groupModel.getGroup(groupId)
			let teacher 	= await teacherModel.getTeacher(groupInfo.teacher_id)
				
			if(config.production) await axios.post('https://api.telegram.org/bot737103729:AAEzrT-lpwFhqMuXG6IiVAOiDmDBgVPmeqM/sendMessage', { chat_id: 310324199, text: `Через час занятие студента ${students[0].lastname} ${students[0].firstname} с номером ${students[0].phone}` })
			
			await alertTeacher(teacher, `Через час у вас занятие с ${group.group_name}!` )

			for(let j = 0; j<students.length; j++) 
				await alertStudent(students[j], 
					'Через час начнется ваше занятие! Не опоздайте!', 
					'Через час начнется ваше занятие! Не опоздайте!')

			await log(`Work with group: ${groupId} is completed`)
			
		} catch(ex) {
			await log('berforeStartLesson error: ', {exeption: ex.message}, 1)
		}
	}
	await log('function beforeStartLesson is completed')
}