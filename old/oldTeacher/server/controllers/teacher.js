let bcrypt 	= require('bcrypt'); 
let model = require('../models/teacher');

exports.getTeacherInfo = async function (req) {	
	let teacher = await model.getTeacherInfoById(req.cookies['SAI']);
	if (!teacher) 							return {status: 202, message: 'no index'};
	else									return {status: 200, body: teacher};
}

exports.updateTeacherInfo = async function (req)
{
	if(!req.body.lastname || !req.body.phone || !req.body.login) return {status: 418, message: 'Заполните все поля!'};

	let updated = await model.updateTeacherInfo(req.body.login, req.body.lastname, req.body.phone, req.cookies['SAI']);

	if (updated) 							return {status: 200, message: 'ok'};
	else									return {status: 202, message: 'not found'};
}

exports.updateTeacherPass = async function (req)
{
	if(!req.body.pass || !req.body.oldpass) return {status: 418, message: 'fields error'};
		
	let pass = await model.getTeacherPassByTeacherId(req.cookies['SAI']);

	if (!pass) 								return {status: 202, message: 'not found'};

	let check = await bcrypt.compare(req.body.oldpass, pass);

	if(!check) 								return {status: 202, message: 'Неверный пароль!'};
						
	let salt = await bcrypt.genSalt(10);
	let hash = await bcrypt.hash(req.body.pass, salt);

	let updated = await model.updateTeacherPass(hash, req.cookies['SAI']);

	if (!updated) 							return {status: 202, message: 'Не удалось изменить пароль ('};
	
	return {status: 200, message: 'ok', hash: hash};
}