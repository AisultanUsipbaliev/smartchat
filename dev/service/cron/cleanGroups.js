let groupModel 	 = require('../../apiModels/group'),
	studentModel = require('../../apiModels/student')

module.exports = async function() {
	try {
		await log('function cleanGroups started')

		let badGroups = await groupModel.getBadGroups()

		for(i=0; i<badGroups.length; i++) {
			await log('BAD GROUP FOUNDED: ' + badGroups[i].group_name)

			let deleted = await groupModel.delete(badGroups[i].group_id)
			if (!deleted) await log(`Can\'t delete group -> groupModel.delete`, {group: badGroups[i]}, 1)

			let badStudents = await studentModel.findGroup(badGroups[i].group_id)
			
			for(j=0; j<badStudents.length; j++) { 
				let reset = await studentModel.resetGroup(badStudents[j].student_id)
				if(!reset) await log('Can\'t delete group -> studentModel.resetGroup', {student: badStudents[j]}, 1)
			}

			if(!badStudents.length) await log('THERE ARE NO STUDENTS IN THIS GROUP')
			else await log(`THERE WAS STUDENTS: ${badStudents.length}`)
		
		}
		await log('function cleanGroups is completed')
	} catch(ex) {
		await log('cleanGroups error: ', {exeption: ex.message}, 1)
		sayMe('cleanGroups', {}, ex.message)
	}
}