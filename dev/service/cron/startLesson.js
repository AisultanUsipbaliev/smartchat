let replacer 			= require('../../apiFunctions/replacer')

let lateModel 			= require('../../apiModels/late'),
	teacherModel 		= require('../../apiModels/teacher'),
	groupModel 			= require('../../apiModels/group'),
	studentModel 		= require('../../apiModels/student'),
	chartModel 			= require('../../apiModels/chart'),
	mailModel 			= require('../../apiModels/mail')

let alertStudent		= require('../functions/alertStudent'),			// student, message, sms	
	alertTeacher 		= require('../functions/alertTeacher'),			// teacher, message
	createUserActivity 	= require('../functions/createUserActivity'),	// userId, isteacher, groupId
	deliverMessages 	= require('../functions/deliverMessages') 		// groupId, students, teacher

module.exports = async function() {
	await log('function startLesson started')
	let now 	= new Date()
	let before 	= now.valueOf() - 1000*60*10 // -10min
	let after 	= now.valueOf() + 1000*60*10 // +10min

	let groups = await chartModel.getBetweenStart(before, after) 
	if(groups.length) 	await log('START LESSONS FOR: ', groups)
	else 				await log('NO LESSONS FOR THIS TIME')

	for(let i = 0; i<groups.length; i++) {
		try {
			let groupId = groups[i].group_id
			await log(`Work with group: ${groupId}`)

			let teacher 	= await teacherModel.findGroup(groupId)
			let students 	= await studentModel.findGroup(groupId)
			let group 		= await groupModel.getGroup(groupId)

			let updatedGroupStarted = await groupModel.setStarted(groupId)
			if(updatedGroupStarted) await log('LESSONS IN THIS GROUP STARTED')
			else 					await log('CANT SET STARTED FOR THIS GROUP')

			let delivered = await alertTeacher(teacher, `Началось занятие с ${group.group_name}`)
			if(!delivered) {
				
				await log(`teacher ${teacher.email} is late`)
				let insertLate = await lateModel.add(teacher.teacher_id, 1, groupId, now.getUTCHours())
				if(insertLate) 	await log('inserted late for teacher ' + teacher.email)
				else 			await log('late insert error for teacher ' + teacher.email)
				
			}
			await createUserActivity(teacher.teacher_id, 1, groupId)
			await deliverMessages(groupId, students, teacher) //******* здесь ошибка

			for(let j = 0; j<students.length; j++) {
				let student = students[j]
				let streamIsOpened = await studentModel.updateStream(student.student_id, 1)
				if(streamIsOpened) await log(`STREAM OPENED FOR STUDENT ${student.student_id}: ${student.firstname} ${student.lastname}`)
				else await log('CANT OPEN STREAM FOR STUDENT: ', student, 1)

				await createUserActivity(student.student_id, 0, groupId)

				let packet 	= await mailModel.getMail(102) 
				let text 	= await replacer(packet.message, student.student_id)

				let delivered = await alertStudent(student, 'Ваше занятие началось!', text)
				if(!delivered) {
					await log(`student ${student.student_id}: ${student.firstname} ${student.lastname} is late`)
					let insertLate = await lateModel.add(student.student_id, 0, groupId, now.getUTCHours())
					if(insertLate) 	await log(`created late for student ${student.student_id}: ${student.firstname} ${student.lastname}`)
					else 			await log(`late insert error for student ${student.student_id}: ${student.firstname} ${student.lastname}`)
				}
			}
			await log('Work with group: ' + groupId + ' is completed')

		} catch(ex) {
			await log('startLesson error: ', {exeption: ex.message}, 1)
			sayMe('startLesson error', {}, ex.message)
		}
	}
	await log('function startLesson is completed')
}