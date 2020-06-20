let bcrypt 	= require('bcryptjs');
let model 	= require('../models/account');
let sendSMS = require('../functions/smsApi');

exports.addStudent = async function (req) {
	let password  = req.body.password;
	let phone = "+7" + req.body.phone;
	let firstname = req.body.firstname;
	let timeDiff = req.body.timeDiff;

	if(!phone) 		return {status: 418, message: 'no phone'};
	if(!password)	return {status: 418, message: 'no password'};
	if(!firstname)	return {status: 418, message: 'no firstname'};
	if(!timeDiff) 	return {status: 418, message: 'no timeDiff'};

	let student = await model.getStudentInfoByPhone(phone);
	if(student) return {status: 400, message: 'phone is registrated'};

	let salt 	= await bcrypt.genSalt(10);
	let hash 	= await bcrypt.hash(password, salt);
	let result 	= await model.addStudent(phone, hash, firstname, timeDiff);

	if(result) writeAction(`Зарегестрирован студент ${req.body.firstname} с номером ${phone}. Разница во времени ${timeDiff} ч.`);

	if(result) 		return {status: 200, message: 'success', phone, password: hash, firstname, id: result};
	else 			return {status: 202, message: 'backend error'};
}

exports.verifyStudent = async function(req) {
	let code = req.body.code;
	let phone = "+7" + req.body.phone;

	if(!code) 		return {status: 418, message: 'no code'};
	if(!phone) 		return {status: 418, message: 'no phone'};

	let authId = await model.getAuthId(phone);
	if(!authId) return {status: 401, message: `no user with phone = ${phone}`};

	if(code == authId) {
		let result = await model.setActive(phone, true);

		let student = await model.getStudentInfoByPhone(phone);
		if(result) writeAction(`Студент ${student.firstname} ${student.lastname} подтвердил(-а) номер ${student.phone}`);

		if(result) 	return {status: 200, message: 'success'}
		else 		return {status: 202, message: 'backend error'}
	}
	else return {status: 400, message: 'code does not coincide'}
}

exports.loginStudent = async function (req) {
	let phone = "+7" + req.body.phone;
	let password  = req.body.password;

	if(!phone) 		return {status: 418, message: 'no phone'};
	if(!password)	return {status: 418, message: 'no password'};

	let studentInfo = await model.getStudentInfoByPhone(phone);
	
	if(!studentInfo) 			return {status: 403, message: 'user not found'};
	if(!studentInfo.is_active) 	return {status: 401, message: 'user in not activated'};
	if(studentInfo.blocked) 	return {status: 406, message: 'user is blocked'};

	let check = await bcrypt.compare(password, studentInfo.pass);
	if(check) await writeAction(`Студент ${studentInfo.firstname} ${studentInfo.lastname} вошел в SmartChat`)
	if(check) 		return {status: 200, message: 'success', password: studentInfo.pass, phone, id: studentInfo.student_id}
	else 			return {status: 402, message: 'nt correct password'};
} 

exports.createAmoUser = async function (req) {

	console.log(req.body)
	

	return {status: 200}
}

exports.sendSMS = async function(req) {
	let phone = "+7" + req.body.phone
	if(!phone)	 	return {status: 418, message: 'no phone'}

	let code = Math.floor(Math.random()*9000)+1000;
	
	if(config.production) {
		let res = await sendSMS(phone, 'Введите этот код: ' + code);
		if(res.data.code != 0) return {status: 402, message: 'cant send sms'}
	}
	let result = await model.updateCode(phone, config.production ? code: 1234)
	if(result) 		return {status: 200, message: 'success'}
	else 			return {status: 403, message: 'user not found'}
}

exports.updatePassword = async function(req)  {
	let phone 		= "+7" + req.body.phone;
	let password 	= req.body.password;
	let code 		= req.body.code;

	if(!phone) 		return {status: 418, message: 'no phone'};
	if(!password) 	return {status: 418, message: 'no password'};
	if(!code)		return {status: 418, message: 'no code'};

	let studentInfo = await model.getStudentInfoByPhone(phone);

	if(!studentInfo) 					return {status: 401, message: 'user not found'};
	if(studentInfo.auth_id != code ) 	return {status: 405, message: 'code doesn\'t coincide'};

	let salt = await bcrypt.genSalt(10);
	let hash = await bcrypt.hash(password, salt);
	let result = await model.updatePassword(phone, hash);
	
	if(result) 							return {status: 200, message: 'success'};
	else 								return {status: 202, message: 'backend error'} 
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

exports.authGoogle = async function(req) {
	if(!req.body.sid) 			return {status: 418, message: 'no sid'}
	if(!req.body.token) 		return {status: 418, message: 'no token'}
	if(!req.body.lastname) 		return {status: 418, message: 'no lastname'}
	if(!req.body.firstname)		return {status: 418, message: 'no firstname'}
	if(!req.body.photo) 		return {status: 418, message: 'no photo'}

	let student = await model.getStudentBySoc(req.body.sid, 3)
	if(!student) {

		let newStudent = await model.addSocial(req.body.firstname, req.body.lastname, req.body.sid, req.body.token, 3)
		
		if(newStudent) await writeAction(`Зарегестрирован студент ${req.body.firstname} ${req.body.lastname} через социальную сеть Google`)
		
		if(newStudent) 	return {status: 200, SAI: newStudent, SI: req.body.sid, ST: 3, STO: req.body.token}
		else 			return {status: 202, message: 'can\'t enter by facebook'}

	} else {

		if(req.body.token != student.socialToken) await model.updateToken(student.student_id, req.body.token)
		await writeAction(`Студент ${student.firstname} ${student.lastname} вошел в SmartChat c Google`)
		return {status: 200, SAI: student.student_id, SI: req.body.sid, ST: 3, STO: req.body.token}

	}
}

exports.authFb = async function(req) {
	if(!req.body.sid) 			return {status: 418, message: 'no sid'}
	if(!req.body.token) 		return {status: 418, message: 'no token'}
	if(!req.body.lastname) 		return {status: 418, message: 'no lastname'}
	if(!req.body.firstname)		return {status: 418, message: 'no firstname'}

	let student = await model.getStudentBySoc(req.body.sid, 0)
	if(!student) {

		let newStudent = await model.addSocial(req.body.firstname, req.body.lastname, req.body.sid, req.body.token, 0)
		
		if(newStudent) await writeAction(`Зарегестрирован студент ${req.body.firstname} ${req.body.lastname} через социальную сеть Facebook`)
		
		if(newStudent) 	return {status: 200, SAI: newStudent, SI: req.body.sid, ST: 0, STO: req.body.token}
		else 			return {status: 202, message: 'can\'t enter by telegram'}

	} else {

		if(req.body.token != student.socialToken) await model.updateToken(student.student_id, req.body.token)
		await writeAction(`Студент ${student.firstname} ${student.lastname} вошел в SmartChat c Facebook`)
		return {status: 200, SAI: student.student_id, SI: req.body.sid, ST: 0, STO: req.body.token}

	}
}

exports.authTg = async function(req) {
	if(!req.body.sid) 			return {status: 418, message: 'no sid'}
	if(!req.body.token) 		return {status: 418, message: 'no token'}
	if(!req.body.lastname) 		return {status: 418, message: 'no lastname'}
	if(!req.body.firstname)		return {status: 418, message: 'no firstname'}

	let student = await model.getStudentBySoc(req.body.sid, 1)
	if(!student) {

		let newStudent = await model.addSocial(req.body.firstname, req.body.lastname, req.body.sid, req.body.token, 1)
		
		if(newStudent) await writeAction(`Зарегестрирован студент ${req.body.firstname} ${req.body.lastname} через социальную сеть Telegram`)
		
		if(newStudent) 	return {status: 200, SAI: newStudent, SI: req.body.sid, ST: 1, STO: req.body.token}
		else 			return {status: 202, message: 'can\'t enter by facebook'}

	} else {

		if(req.body.token != student.socialToken) await model.updateToken(student.student_id, req.body.token)
		await writeAction(`Студент ${student.firstname} ${student.lastname} вошел в SmartChat c Telegram`)
		return {status: 200, SAI: student.student_id, SI: req.body.sid, ST: 1, STO: req.body.token}

	}
}

