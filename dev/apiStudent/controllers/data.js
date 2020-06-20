let studentModel = require('../../apiModels/student')
let sendActivationCode = require('../functions/sendActivationCode')

exports.addPushToken = async function (req) {
	if(!req.body.token) return {status: 418, message: 'no token'}
	let res = await studentModel.addToken(req.body.myId, req.body.token)
 	return res? {status: 200}: {status: 202}
}

exports.newEmail = async function (req) {
	if(!req.body.email) 	return {status: 418, message: 'no email'}

	let student = await studentModel.getStudent(req.body.myId)

	let ok = await sendActivationCode(req.body.email, student.firstname, student.lastname, req.body.myId)
	// if(!ok) return {status: 406, message: 'wrong email'} 

	let result = await studentModel.updateEmail(req.body.myId, req.body.email)
	return result? {status:200}: {status: 500}
}

exports.repeatEmail = async function(req) {
	let student = await studentModel.getStudent(req.body.myId)
	let ok = await sendActivationCode(student.email, student.firstname, student.lastname, student.student_id)
	return ok ? {status: 200}: {status: 202}
}

exports.newPhone = async function(req) {
	if(!req.body.phone) return {status: 418, message: 'no phone'}
	if(!req.body.code) 	return {status: 418, message: 'no code'}

	let student = await studentModel.getStudent(req.body.myId)
	if(student.auth_id != req.body.code) return {status: 202, message: 'wrong code'}

	await studentModel.updatePhone(req.body.myId, req.body.phone)
	await studentModel.activatePhone(req.body.myId)

	return {status: 200}
}