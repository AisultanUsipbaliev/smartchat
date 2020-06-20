let lateModel 		= require('../model/late')
let studentModel	= require('../model/student')

let call = require('../functions/call')

module.exports = async function() {
	let date = new Date()
	let hr = date.getUTCHours()

	let students = await lateModel.getLateStudents(hr) 

	for(let i=0; i<students.length; i++) {
		try {
			let student = await studentModel.getStudent(students[i].id)
			if(student.phone) 
				await call(student.phone, 5, `Вы опаздываете на занятие! Скорее переходите по ссылке: ${config.hostname}/guide?code=${student.guide}`)
		} catch(ex) {
			console.log(ex)
			sayMe('alertcron ' + student.student_id, ex.message)
		}
	}
}