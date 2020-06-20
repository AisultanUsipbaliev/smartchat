let bcrypt 		= require('bcryptjs')
let translit 	= require('cyrillic-to-translit-js')
var getIP 		= require('request-ip').getClientIp

let sendSMS 	= require('../../apiFunctions/smsApi')
let getHash 	= require('../../apiFunctions/getHash')
let sendCode 	= require('../../apiFunctions/sendActivationCode')
let generateId 	= require('../../apiFunctions/generateId')

let countryCodeModel	= require('../../apiModels/countryCode')
let teacherModel 		= require('../../apiModels/teacher')
let ingressModel 		= require('../../apiModels/ingress')

exports.addTeacher = async (req) => {
	if(!req.body.login)		return {status: 418, message: 'no login'}
	if(!req.body.lastname)	return {status: 418, message: 'no lastname'}
	if(!req.body.email)		return {status: 418, message: 'no email'}
	if(!req.body.phone) 	return {status: 418, message: 'no phone'}
	if(!req.body.password) 	return {status: 418, message: 'no password'}

	let teacher = await teacherModel.findPhone(req.body.phone)
	if(teacher) return {status: 409, message: 'phone is registrated'}

	teacher = await teacherModel.findEmail(req.body.email)
	if(teacher) return {status: 409, message: 'email is registrated'}

	let pass = await getHash(req.body.password)
	let teacherId = await teacherModel.addTeacher(req.body.login, req.body.lastname, req.body.email, req.body.phone, pass)

	if(teacherId) {

		let code = await generateId(10)
		let href = `${config.teacherHostname}/activateEmail?code=${code}`
		await teacherModel.updateEmailCode(teacherId, code)
		sendCode(req.body.email, req.body.login + ' ' + req.body.lastname, href)

		writeAction(`Зарегестрирован преподаватель ${req.body.login} ${req.body.lastname} с номером ${req.body.phone}`)
		writeIngress(req, teacherId)
		return {
			status: 200, 
			message: 'success', 
			id: teacherId,
			login: req.body.login, 
			lastname: req.body.lastname,
			password: pass,
			phone: req.body.phone
		}
	} else throw new Error('Can\'t add teacher -> teacherModel.addTeacher')
}

exports.sendSMS = async (req) => {
	if(!req.body.phone) return {status: 418, message: 'no phone'}

	let teacher = await teacherModel.findPhone(req.body.phone)
	if(!teacher) return {status: 404, message: 'user not found'}
		
	let code = Math.floor(Math.random()*9000)+1000
	
	if(config.production) {
		let res = await sendSMS(req.body.phone, 'Enter this key: ' + code)
		if(res.data.code != 0) return {status: 403, message: 'cant send sms'}
	}

	let result = await teacherModel.updateSmsCode(teacher.teacher_id, config.production ? code : 1234)

	if(result) 	return {status: 200}
	else throw new Error('Can\'t update auth code -> teacherModel.updateSmsCode')
}

exports.verifyTeacher = async (req) => {
	if(!req.body.phone) return {status: 418, message: 'no phone'}
	if(!req.body.code) 	return {status: 418, message: 'no code'}

	let teacher = await teacherModel.findPhone(req.body.phone)
	if(!teacher) return {status: 404, message: 'user not found'}

	if(req.body.code == teacher.smsCode) {

		let result = await teacherModel.activatePhone(teacher.teacher_id)
		if(result) { 
			writeAction(`Преподаватель ${teacher.login} ${teacher.lastname} подтвердил(-а) номер ${teacher.phone}`)
			return {status: 200, message: 'success'}

		} throw new Error('Can\'t activate phone -> teacherModel.activatePhone')

	} else return {status: 417, message: 'code does not coincide'}
}

exports.updatePassword = async (req) => {
	if(!req.body.phone) 	return {status: 418, message: 'no phone'}
	if(!req.body.password) 	return {status: 418, message: 'no password'}
	if(!req.body.code)		return {status: 418, message: 'no code'}

	let teacher = await teacherModel.findPhone(req.body.phone)

	if(!teacher) 							return {status: 404, message: 'user not found'}
	if(teacher.smsCode != req.body.code) 	return {status: 417, message: 'code doesn\'t coincide'}
	
	let check = await bcrypt.compare(req.body.password, teacher.pass)
	if(check) 	return {status: 400, message: 'you confirm pass'}

	let pass = await getHash(req.body.password)
	let result = await teacherModel.updatePassword(teacher.teacher_id, pass)
	
	if(result) 							return { status: 200, message: 'success', password: pass }
	else throw new Error('Can\'t update password -> teacherModel.updatePassword')
}

exports.getCountries = async (req) => {
	let codes = await countryCodeModel.getCodes()
	return {status: codes.length>0? 200:202, codes}
}

exports.findCountry = async (req) => {
	if(!req.body.part) return {status: 418, message: 'no part'}

	let part = translit().transform(req.body.part)
	let codes = await countryCodeModel.findCountry(part)
	return {status: codes.length>0? 200:202, codes}
}

exports.loginTeacher = async (req) => {

	if(!req.body.phone && !req.body.email) 	return {status: 418, message: 'no contact'}
	if(!req.body.password)					return {status: 418, message: 'no password'}

	let teacher = req.body.phone ? await teacherModel.findPhone(req.body.phone) : await teacherModel.findEmail(req.body.email)

	if(!teacher) return {status: 401}

	// if(teacher.blocked) 		return {status: 423, message: 'user is blocked'}

	let check = await bcrypt.compare(req.body.password, teacher.pass)

	if(check) {
		writeAction(`Выполнена авторизация преподавателя  ${teacher.login} ${teacher.lastname}`)
		writeIngress(req, teacher.teacher_id)
		if(!teacher.is_active) return {
			status: 303, 
			message: 'user in not activated', 
			id 		: teacher.teacher_id,
			login 	: teacher.login,
			email	: teacher.email,
			password: teacher.pass,
			phone 	: teacher.phone
		}
		return {
			status 	: 200, 
			message : 'success', 
			id 		: teacher.teacher_id,
			login 	: teacher.login,
			email 	: teacher.email,
			password: teacher.pass,
			phone 	: teacher.phone
		}
	} else return {status: 401, message: 'wrong password'}
}

async function writeIngress(req, id) {

	let ip 		= await getIP(req)
	let agent 	= req.headers['user-agent']

	await ingressModel.add(1, id, ip, agent)
}