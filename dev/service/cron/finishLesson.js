let usedtemplateModel 	= require('../../apiModels/usedtemplate'),
	teacherModel 		= require('../../apiModels/teacher'),
	groupModel 			= require('../../apiModels/group'),
	studentModel 		= require('../../apiModels/student'),
	chartModel 			= require('../../apiModels/chart'),
	implementationModel = require('../../apiModels/implementation')

let alertStudent		= require('../functions/alertStudent'), 	// student, message, sms	
	alertTeacher 		= require('../functions/alertTeacher'),		// teacher, message
	checkLastLesson 	= require('../functions/checkLastLesson'),	// studentId, currentLesson
	createFeedback 		= require('../functions/createFeedback'),	// studentId, teacher
	checkUserLate		= require('../functions/checkUserLate'),	// user, isteacher, group
	createSertificat 	= require('../functions/createSertificat'),	// student
	chatReport			= require('../functions/chatReport')		// group

module.exports = async function(flag) {
	await log('function finishLesson started')

	let before 	= (new Date()).valueOf() - 600000 // - 10 минут 
	let after 	= (new Date()).valueOf() + 600000 // + 10 минут
	
	let groups = await chartModel.getBetweenFinish(before, after)
	if(groups.length) 	await log('FINISHED LESSONS IN GROUPS: ', groups)
	else 				await log('NO FINISHED LESSONS')
	
	for(i=0; i<groups.length; i++) {
		try {
			let groupId 		= groups[i].group_id
			let currentLesson 	= groups[i].lesson

			await log(`Working with group: ${groupId}`)

			let students 	= await studentModel.findGroup(groupId)
			let group 		= await groupModel.getGroup(groupId)
			let teacher 	= await teacherModel.getTeacher(group.teacher_id)
		
			let deleteUsed = await usedtemplateModel.delete(groupId)
			if(deleteUsed) 	await log('USEDTEMPLATES ARE DELITED!')
			else 			await log('USEDTEMPLATES ARE NOT DELETED!')

			let upLesCount = await teacherModel.increaseLesCount(teacher.teacher_id)
			if(upLesCount) 	await log('TEACHER LESS-COUNT RASED')
			else 			await log('TEACHER LESS-COUNT IS CONSTANT')

			// await alertTeacher(teacher, `Закончилось занятие с ${group.group_name}`)
			await checkUserLate(teacher, 1, group)

			for(j=0; j<students.length; j++) {

				let student = students[j]
				let closeStream = await studentModel.closeStream(student.student_id)
				if(closeStream) await log(`CLOSED STREAM FOR STUDENT ${student.student_id}: ${student.firstname} ${student.lastname}`)
				else await log(`STREAM CLOSE ERROR FOR STUDENT ${student.student_id}: ${student.firstname} ${student.lastname}`)

	 			let isLast = await checkLastLesson(student.student_id, currentLesson)
				if(isLast) { 
					await log('THIS IS LAST LESSON')
					await createFeedback(student.student_id, teacher)
					if(group.rate_id == 2) {
						await createSertificat(student)
						await setScore(student.student_id, 3)
					}
					await chatReport(group)
				}

				await alertStudent(student, 'Ваше занятие закончилось!')
				await checkUserLate(student, 0, group)
			}
			
		} catch(ex) {
			await log('finishLesson error: ', {exeption: ex.message}, 1)
			sayMe('finishLesson', {}, ex.message)
		}
	}
	await log('function finishLesson is completed')
}


async function setScore(studentId, type) {
	let implementation = await implementationModel.get(type)
	if (!implementation) sayMe('checkUserActivity', {}, 'implementation not found')
	else {
		let setScore = await studentModel.updateScore(studentId, implementation.value)
		if (!setScore) sayMe('checkUserActivity', {}, 'Can\'t set score -> studentModel.updateScore')
	}
}
