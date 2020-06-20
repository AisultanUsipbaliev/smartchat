let bcrypt 	= require('bcryptjs')
let getHash = require('../functions/getHash')
let sendActivationCode = require('../functions/sendActivationCode')

let rankModel		= require('../../apiModels/rank')
let groupModel 		= require('../../apiModels/group')
let chartModel		= require('../../apiModels/chart')
let studentModel 	= require('../../apiModels/student')
let sertificatModel = require('../../apiModels/sertificat')

exports.getProfile = async function (req) {
	let profile 	= await studentModel.getProfile(req.body.myId)
	let rank		= await rankModel.find([profile.score])
	let prevRank 	= await rankModel.getPrev([profile.score])
	let sertificats = await sertificatModel.getStudentSertificats(req.body.myId)
	let teacher 	= profile.group_id? await groupModel.getTeacher(profile.group_id):null
	let rate 		= profile.group_id? await groupModel.getRate(profile.group_id):null
	let lessons 	= profile.group_id? (await chartModel.getStudentChart(req.body.myId)).length: null

	return {status: 200, profile, teacher, rate, sertificats, lessons, rank, prevRank}
}

exports.updatePassword = async function(req) {
	if(!req.body.old) 			return {status: 418, message: 'no old'}
	if(!req.body.password) 		return {status: 418, message: 'no password'}

	let student = await studentModel.getStudent(req.body.myId)

	let check = await bcrypt.compare(req.body.old, student.pass)
	if(!check) return {status: 403, message: 'old password is incorrect'}
	else {
		let pass = await getHash(req.body.password)
		let result = await studentModel.updatePassword(req.body.myId, pass)
		if(result) 	return {status: 200, message: 'success', pass}
		else 		throw new Error('Can\'t update password')
	}
}

exports.updateProfile = async function(req) {
	if(!req.body.firstname)		return {status: 418, message: 'no firstname'}
	if(!req.body.lastname)		return {status: 418, message: 'no lastname'}
	if(!req.body.birthday)		return {status: 418, message: 'no birthday'}
	if(!req.body.email) 		return {status: 418, message: 'no email'}

	let student = await studentModel.getStudent(req.body.myId)
	let res 	= await studentModel.updateProfile(req.body.myId, req.body.firstname, req.body.lastname, req.body.birthday, req.body.email)
	let deactivated = false

	if(student.email != req.body.email) {
		await studentModel.deactivateEmail(req.body.myId)
		await sendActivationCode(req.body.email, req.body.firstname, req.body.lastname, req.body.myId)
		deactivated = true
	}

	if(res) 	return {status: 200, deactivated}
	else		throw new Error('Can\'t update student profile')
}

exports.updateSMSStatus = async function(req) {
	if(!req.body.status) return {status:418, message: 'no status'}

	let student = await studentModel.getStudent(req.body.myId)
	
	if(req.body.status == 'on') {
		if(!student.phone) 		return {status: 201, message: 'no phone'}
		if(!student.is_active)	return {status: 201, message: 'phone is not activated'}

		let res = await studentModel.updateSMSOn(req.body.myId, 1)
		return res? {status: 200}: {status:202}
 	} else {
 		let res = await studentModel.updateSMSOn(req.body.myId, 0)
		return res? {status: 200}: {status:202}
	}
}

exports.updateEmailStatus = async function(req) {
	if(!req.body.status) return {status: 418, message: 'no status'}

	let student = await studentModel.getStudent(req.body.myId)
	
	if(req.body.status == 'on') {
		if(!student.email) 		return {status: 201, message: 'no email'}
		if(!student.activated)	return {status: 202, message: 'email is not activated'}

		let res = await studentModel.updateMailOn(req.body.myId, 1)
		return res? {status: 200}: {status:202}
	} else {
		let res = await studentModel.updateMailOn(req.body.myId, 0)
		return res? {status: 200}: {status:202}
	}
}