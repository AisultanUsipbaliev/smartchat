let fs = require('fs')
let dateFormat = require('../../apiFunctions/dateFormat')

let groupModel = require('../../apiModels/group'),
	chatModel = require('../../apiModels/chat')

module.exports = async (group) => { 
	try {
		let groupId = group.group_id
		let student = await groupModel.getStudent(groupId)
		let teacher = await groupModel.getTeacher(groupId)
		let rate 	= await groupModel.getRate(groupId)
		let level	= await groupModel.getLevel(groupId)

		let confines 	= await chatModel.getConfines(groupId)

		let fileName = `chat_${student.student_id}_${await dateFormat('HHMMSSddmmyyyy')}`
		let file = `../chatReports/${fileName}.log`
	
		await write( file, `
Отчет от ${await dateFormat('dd.mm.yyyy')}
----------------------------------------------------------------
Студент ${student.firstname} ${student.lastname} (phone: ${student.phone}, email: ${student.email})
С уровнем ${level.lvl_name}
Проходил обучение по тарифу ${rate.rate_name}
С преподавателем ${teacher.login} ${teacher.lastname} (email:${teacher.email}, phone: ${teacher.phone})
----------------------------------------------------------------
Дата начала занятий: ${await dateFormat('HH:MM dd.mm.yyyy', confines.start)}
Дата окончания занятий: ${await dateFormat('HH:MM dd.mm.yyyy', confines.finish)}
-----------------------------------------------------------------
`)
	
		let days = []
		let lesson = 1

		let messages = await chatModel.getAll(groupId)

		for(i=0; i<messages.length; i++) {
			let m = messages[i]
			let day = `${m.dt.getDate()}${m.dt.getMonth()}${m.dt.getFullYear()}` 

			if(days.indexOf(day) == -1) {
				await write(file, `\nЗанятие №${lesson} ${await dateFormat('dd.mm.yyyy', m.dt)}\n`)
				days.push(day)
				lesson++
			}

			await write(file, `${m.mes_id}) ${m.sender_name}\n${await dateFormat('HH:MM', m.dt)}: ${m.content.trim()} (${m.type}) ${m.reference?' -> ' + m.reference: ''}\n`)

		}
	} catch(ex) {
		// sayMe('service/chartReport', {groupId}, ex.message)
		console.log(ex)
	}
}

async function write(file, string) {	
	if(!( fs.existsSync(file))) fs.writeFileSync(file, '', 'binary')
	await fs.appendFileSync( file, string)
}