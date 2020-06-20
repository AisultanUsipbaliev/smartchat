let lateModel 		= require('../../apiModels/late'),
	studentModel	= require('../../apiModels/student'),
	mailModel		= require('../../apiModels/mail')

let call 			= require('../../apiFunctions/call')
let replacer 		= require('../../apiFunctions/replacer')

module.exports = async function() {
	let date = new Date()
	let hr = date.getUTCHours()

	let students = await lateModel.getLateStudents([hr]) 

	for(let i=0; i<students.length; i++) {
		try {
			log(`student #${students[i].id} is late`)
			let student = await studentModel.getStudent(students[i].id)
			let packet 	= await mailModel.getMail(103) 
			let text 	= await replacer(packet.message, student.student_id)

			if(student.phone) await call(student.phone, packet.call, text)

		} catch(ex) {
			console.error('alertcron error: ', ex)
			log('alertcron error: ' + ex.message, {}, 1)
			sayMe('alertcron' + student.student_id, {}, ex.message)
		}
	}
}