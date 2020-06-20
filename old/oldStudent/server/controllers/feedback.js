let model = require('../models/feedback');

exports.feedSmart = async function(req)
{
	if(!req.body.value) 	return {status: 418, message: 'no value'};
	let comment = req.body.comment || '';

	let student = await model.getStudent(req.body.myId);
	writeAction('Отзыв о Smartchat от студента ' + student.firstname + ': Оценка : ' + req.body.value + '! Комментарий: ' + comment);

	let res = await model.feedSmart(req.body.myId, comment, req.body.value);
	if(res) await model.deleteSmart(req.body.myId);
	return res? {status: 200} : {status: 202};
}

exports.feedTeacher = async function(req)
{
	if(!req.body.value) 		return {status: 418, message: 'no value'};
	if(!req.body.teacher_id)	return {status: 418, message: 'no teacher_id'};
	let comment = req.body.comment || '';

	let student = await model.getStudent(req.body.myId);
	let teacher = await model.getTeacher(req.body.teacher_id);
	writeAction('Отзыв о преподавателе ' + teacher.email + ' от студента ' + student.firstname + ': Оценка : ' + req.body.value + '! Комментарий: ' + comment);

	let res = await model.feedTeacher(req.body.teacher_id, req.body.myId, comment, req.body.value);
	if(res) await model.deleteTeacher(req.body.teacher_id, req.body.myId);
	return res? {status: 200} : {status: 202};
}

exports.sendReport = async function(req)
{
	if(!req.body.comment) 		return {status: 418, message: 'no comment'};

	let student = await model.getStudent(req.body.myId);
	writeAction(`Обратная связь от студента ${student.firstname}: ${req.body.comment}. ${req.body.file? ' web.smartchat.kz/common/files/' + req.body.file:''}`);

	let res = await model.sendReport(req.body.myId, req.body.comment, req.body.file);
	if(res) return {status: 200};
	else 	return {status: 202};
}