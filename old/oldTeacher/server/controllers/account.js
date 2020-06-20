let bcrypt = require('bcryptjs');
let model = require('../models/account');
var getIP = require('request-ip').getClientIp
let sendMail = require('../modules/mailApi')

exports.loginTeacher = async function (req) {
	if (!req.body.email) 	return {status: 418, message: 'no email'};
	if (!req.body.pass) 	return {status: 418, message: 'no pass'};

	let teacher 	= await model.getTeacherInfoByEmail(req.body.email.toLowerCase());

	if (!teacher) 			return {status: 202, message: 'Неверный email!'};
	if (!teacher.activated) return {status: 201, message: 'Аккаунт не активирован!', pass: teacher.pass, teacher_id: teacher.teacher_id, login: teacher.login};

	let check 		= await bcrypt.compare(req.body.pass, teacher.pass);

	if(check) {
	
		writeIngress(req, teacher.teacher_id)
		return {status: 200, message: 'success', pass: teacher.pass, teacher_id: teacher.teacher_id, login: teacher.login}
	
	} else return {status: 202, message: 'Неверный пароль!'};
}

exports.addTeacher = async function (req) {
	if(!req.body.login) 	return {status: 418, message: 'no login'};
	if(!req.body.lastname) 	return {status: 418, message: 'no lastname'};
	if(!req.body.phone)		return {status: 418, message: 'no phone'};
	if(!req.body.pass) 		return {status: 418, message: 'no pass'};
	if(!req.body.email) 	return {status: 418, message: 'no email'};

	let salt 		= await bcrypt.genSalt(10);
	let hash 		= await bcrypt.hash(req.body.pass, salt);
	let result 		= await model.addTeacher(req.body.login, req.body.lastname, req.body.phone, hash, req.body.email.toLowerCase());

	if(result) {
		let res = sendActivationCode(req.body.email, req.body.login, req.body.lastname, result);
		if(res) {
			let teacher = await model.getTeacherInfoByEmail(req.body.email.toLowerCase());
			await writeAction(`Зарегестирован преподаватель ${req.body.email} : ${req.body.login} ${req.body.lastname}`);
			writeIngress(req, teacher.teacher_id)
			if (teacher)		return {status: 200, message: 'success', pass: teacher.pass, teacher_id: teacher.teacher_id, login: teacher.login};
			else				return {status: 202, message: 'user not found'};
		}
		else {
			await model.deleteTeacher(result);
			return {status: 201, message: 'wrong email'};
		}
	} 		
	else return {status: 202, message: 'backend error'};
}

exports.checkTeacher = async function (req) {
	if(!req.body.email) 	return {status: 418, message: 'no email'};

	let teacher 	= await model.getTeacherInfoByEmail(req.body.email.toLowerCase());
	if (teacher) 			return {status: 202, message: 'Пользователь с таким Email уже существует!'};
	else					return {status: 200, message: 'Хороший email!'};
}

exports.repeatEmail = async function(req) {
	let teacher 	= await model.getTeacher(req.cookies.SAI);
	let res = sendActivationCode(teacher.email, teacher.login, teacher.lastname, teacher.teacher_id);
	return res ? {status: 200, message: 'success'} : {status: 202, message: 'invalid email'};
}


 
async function sendActivationCode(email, firstname, lastname, id) {
	console.log('sendActivationCode')
	let code = makeid();
	await model.updateEmailCode(id, code);

	let href = `${config.teacherHostname}/activateEmail?code=${code}`;

	let mailOptions = {
		from: `"SmartChat" <${config.transport.auth.user}>`,
		to: email, 
		subject: 'Активация аккаунта',
		html: `
		<table>
			<tr>
				<td>Уважаемый ${firstname} ${lastname}</td>
			</tr>
			<tr>
				<td>Перейдите по ссылке для активации аккаунта:</td>
				<td>${href}</td>
			</tr>
		</table>`
	}

	let ok = true;

	await sendMail(mailOptions, (res)=>
		{
			ok = res.success;
		});
	return ok;
}


function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

async function writeIngress(req, id) {

	let ingressModel = require('../model/ingress')

	let ip = await getIP(req)
	let agent = req.headers['user-agent']

	await ingressModel.add(1, id, ip, agent)

}