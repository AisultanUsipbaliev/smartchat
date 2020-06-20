let userInSystem = require('./userInSystem'),
	studentModel = require('../../apiModels/student'),
	teacherModel = require('../../apiModels/teacher')

module.exports = async function(ws, req) {
	try {
		let SAI 	= req.cookies['SAI']
		let SAU 	= req.cookies['SAU']
		let STO 	= req.cookies['STO']
		let SAT 	= req.cookies['SAT']
		let SAP 	= req.cookies['SAP']
		let SI 		= req.cookies['SI']
		let ST 		= req.cookies['ST']

		let student = null
		let teacher = null

		if(SAT) 				teacher = await teacherModel.check(SAT, SAP)
		else if(SAU || STO)  	student = await studentModel.check(SAU, SAP) || await studentModel.findSocial2(SI, ST)
		else {
			console.log('who are you?')
			ws.send(JSON.stringify({notice: 111}))
		}

		if(teacher) {
			ws.userid = 't' + SAI
			await userInSystem(SAI, 1)
			console.log(`connected teacher #${SAI} ${teacher.login} ${teacher.lastname}`)
		} else if(student) {
			ws.userid = 's' + SAI
			await userInSystem(SAI, 0)
			console.log(`connected student #${SAI} ${student.firstname} ${student.lastname}`)
		} else {
			console.log('wrong cookies')
			ws.send(JSON.stringify({notice: 111}))
		}
	} catch(err) {
		sayMe('socket clientConnect', {}, err.message)
	}
}