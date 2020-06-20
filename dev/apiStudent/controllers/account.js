let bcrypt 	= require('bcryptjs')
var getIP = require('request-ip').getClientIp
let sendSMS = require('../functions/smsApi')
let getHash = require('../functions/getHash')

let translate 	= require('../translator')
let translit 	= require('cyrillic-to-translit-js')

let countryCodeModel	= require('../../apiModels/countryCode')
let ingressModel		= require('../../apiModels/ingress')
let studentModel		= require('../../apiModels/student')
let teacherModel		= require('../../apiModels/teacher')

exports.getStrings = async function(req) {
	if(!req.body.page) return {status: 418, message: 'no page'}

	let strings = await translate(req.body.page, req.cookies.SAL)
	return {status: 200, strings}
}

exports.getCountries = async function(req) {
	let codes = await countryCodeModel.getCodes()
	return {status: codes.length>0? 200:202, codes}
}

exports.findCountry = async function(req){
	if(!req.body.part) return {status: 418, message: 'no part'}

	let part = translit().transform(req.body.part)
	let codes = await countryCodeModel.findCountry(part)
	return {status: codes.length>0? 200:202, codes}
}

exports.addStudent = async function (req) {
	if(!req.body.phone) 	return {status: 418, message: 'no phone'}
	if(!req.body.password)	return {status: 418, message: 'no password'}
	if(!req.body.firstname)	return {status: 418, message: 'no firstname'}

	let student = await studentModel.findPhone(req.body.phone)
	if(student) return {status: 409, message: 'phone is registrated'}

	let firstname = req.body.firstname.split(' ')[0]
	let lastname = req.body.firstname.split(' ')[1]
	lastname = lastname?lastname:''

	let pass 		= await getHash(req.body.password)
	let resultId 	= await studentModel.addStudent(req.body.phone, pass, firstname, lastname)

	if(resultId) {
		writeIngress(req, resultId)
		writeAction(`Зарегестрирован студент ${req.body.firstname} с номером ${req.body.phone}`)
		return {
			status: 200, 
			message: 'success', 
			phone: req.body.phone, 
			password: pass, 
			firstname: req.body.firstname, 
			id: resultId
		}
	} else throw new Error('Can\'t add student -> studentModel.addStudent')
}

exports.addTeacher = async (req) => {
	if(!req.body.phone) 	return {status: 418, message: 'no phone'}
	if(!req.body.email) 	return {status: 418, message: 'no email'}
	if(!req.body.firstname)	return {status: 418, message: 'no firstname'}
	if(!req.body.lastname) 	return {status: 418, message: 'no lastname'}

	let resultId = await teacherModel.add()
	return resultId ? {status: 200}:{status:202}
}

exports.verifyStudent = async function(req) {
	if(!req.body.phone) return {status: 418, message: 'no phone'}
	if(!req.body.code) 	return {status: 418, message: 'no code'}

	let student = await studentModel.findPhone(req.body.phone)
	if(!student) return {status: 404, message: 'user not found'}

	if(req.body.code == student.auth_id) {

		let result = await studentModel.activatePhone(student.student_id)
		if(result) { 

			writeAction(`Студент ${student.firstname} ${student.lastname} подтвердил(-а) номер ${student.phone}`)
			return {status: 200, message: 'success'}

		} throw new Error('Can\'t activate phone -> studentModel.activatePhone')

	} else return {status: 417, message: 'code does not coincide'}
}

exports.loginStudent = async function (req) {
	if(!req.body.phone) 	return {status: 418, message: 'no phone'}
	if(!req.body.password)	return {status: 418, message: 'no password'}

	let student = await studentModel.findPhone(req.body.phone)
	if(!student) 				return {status: 401}

	if(student.blocked) 		return {status: 423, message: 'user is blocked'}

	let check = await bcrypt.compare(req.body.password, student.pass)
	if(check) {
		writeIngress(req, student.student_id)
		writeAction(`Выполнена авторизация студента ${student.firstname} (${student.phone})`)

		if(!student.is_active) return {
			status: 303, 
			message: 'user in not activated', 
			password: student.pass, 
			phone 	: req.body.phone, 
			id 		: student.student_id
		}
		
		return {
			status 	: 200, 
			message : 'success', 
			password: student.pass, 
			phone 	: req.body.phone, 
			id 		: student.student_id
		}

	} else return {status: 401}
}

exports.sendSMS = async function(req) {
	if(!req.body.phone) return {status: 418, message: 'no phone'}

	let student = await studentModel.findPhone(req.body.phone)
	if(!student && !req.body.api) 	return {status: 404, message: 'user not found'}
	// if(student && req.body.api) 	return {status: 202, message: 'already written'}
	
	if(req.body.api) student = await studentModel.getStudent(req.body.myId)
		
	let code = Math.floor(Math.random()*9000)+1000
	
	if(config.production) {
		let res = await sendSMS(req.body.phone, 'Enter this key: ' + code)
		if(res.data.code != 0) return {status: 403, message: 'cant send sms'}
	}

	let result = await studentModel.updateAuthCode(student.student_id, config.production ? code: 1234)
	if(result) 	return {status: 200}
	else throw new Error('Can\'t update auth code -> studentModel.updateAuthCode')
}

exports.updatePassword = async function(req)  {
	if(!req.body.phone) 	return {status: 418, message: 'no phone'}
	if(!req.body.password) 	return {status: 418, message: 'no password'}
	if(!req.body.code)		return {status: 418, message: 'no code'}

	let student = await studentModel.findPhone(req.body.phone)

	if(!student) 							return {status: 404, message: 'user not found'}
	if(student.auth_id != req.body.code) 	return {status: 417, message: 'code doesn\'t coincide'}
	
	let check = await bcrypt.compare(req.body.password, student.pass)	
	if(check) 	return {status: 400, message: 'you confirm pass'}

	let pass = await getHash(req.body.password)
	let result = await studentModel.updatePassword(student.student_id, pass)
	
	if(result) 							return {status: 200, message: 'success', password: pass}
	else throw new Error('Can\'t update password -> studentModel.updatePassword')
}

exports.vkURL = async function(req) {
	return {
		status: 200, 
		redirect: `https://oauth.vk.com/authorize?client_id=${config.vk.client_id}&display=page&redirect_uri=${config.vk.redirect}&scope=email,photos,wall,ads,offline,&response_type=code&v=${config.vk.v}`
	}
}

exports.mailURL = async function(req) {
	return {
		status: 200, 
		redirect: `https://connect.mail.ru/oauth/authorize?client_id=${config.mail.client_id}&redirect_uri=${config.mail.redirect}&response_type=code`
	}
}

exports.authSocial = async function(req) {
	if(!req.body.sid) 			return {status: 418, message: 'no sid'}
	if(!req.body.token) 		return {status: 418, message: 'no token'}
	if(!req.body.lastname) 		return {status: 418, message: 'no lastname'}
	if(!req.body.firstname)		return {status: 418, message: 'no firstname'}
	if(!req.body.type) 			return {status: 418, message: 'no type'}

	switch(Number(req.body.type)) {
		case 0: req.body.social = 'Facebook';	break;
		case 1: req.body.social = 'Telegram'; 	break;
		case 2: req.body.social = 'MAIL.RU'; 	break;
		case 3: req.body.social = 'Google'; 	break;
		case 4: req.body.social = 'Vkontakte'; 	break;
		default: return {status: 418, message: 'invalid type'}
	}

	let student = await studentModel.findSocial2(req.body.sid, req.body.type)
	
	if(!student) {
		let newStudent = await studentModel.addSocial(req.body.firstname, req.body.lastname, req.body.sid, req.body.token, req.body.type)
		if(newStudent) {
			writeAction(`Зарегестрирован студент ${req.body.firstname} ${req.body.lastname} через социальную сеть ${req.body.social}`)
			writeIngress(req, newStudent)
			return {status: 200, SAI: newStudent, SI: req.body.sid, ST: req.body.type, STO: req.body.token}
		} else throw new Error('Can\'t enter by '+req.body.social)
	} else {
		writeAction(`Выполнена авторизация студента ${student.firstname} ${student.lastname} с соц. сети ${req.body.social}`)
		writeIngress(req, student.student_id)
		return {status: 200, SAI: student.student_id, SI: req.body.sid, ST: req.body.type, STO: student.socialToken}
	}
}


async function writeIngress(req, id) {

	let ip 		= await getIP(req)
	let agent 	= req.headers['user-agent']

	await ingressModel.add(0, id, ip, agent)

}