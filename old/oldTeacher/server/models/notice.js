let SQL = require('../modules/query');

exports.getNoticeByTeacherId = async function(teacher_id)
{
	return await SQL('select * from notice where user_id = ? and isteacher = 1', teacher_id);
}

exports.getReqByTeacherId = async function(teacher_id)
{
	return await SQL('select student_id from req where teacher_id = ? group by student_id', teacher_id);
}

exports.getChatByTeacherId = async function(teacher_id)
{
	return await SQL('select * from chat where isread = false and delivered = 1 and group_id in (select group_id from gr where teacher_id = ?)', teacher_id);
}

exports.getResultByTeacherId = async function(teacher_id)
{
	return await SQL('select result_id from result where test_id in (select test_id from test where teacher_id = ?) and isread = 0', teacher_id);
}

exports.getGraphByTeacherId = async function(teacher_id)
{
	return await SQL('select * from graph where teacher_id = ?', teacher_id);
}

exports.deleteNoticeByTeacherId = async function(teacher_id) 
{
	let res = await SQL('delete from notice where user_id = ? and isteacher = 1', teacher_id);

	if(res.affectedRows > 0) 	return true;
	else 						return false;
}


//Опоздания
exports.getLate = async function(id, hr)
{
	return await SQL('select * from late where user_id = ? and hr = ? and isteacher = 1', [id, hr]);
}
exports.getGroup = async function(id)
{
	return (await SQL('select * from gr where group_id = ?', id))[0];
}
exports.getTeacher = async function(id) 
{
	return (await SQL('select * from teacher where teacher_id = ?', id))[0];
}
exports.getStudent = async function(id)
{
	return (await SQL('select * from student where student_id = ?', id))[0];
}
exports.deleteLate = async function(id)
{
	let res = await SQL('delete from late where id = ?', id);
	if(res.affectedRows > 0)	return true;
	else 					 	return false;
}

exports.getOldReqs = async function(id, today)
{
	return await SQL('select * from req where req_dt < ? and teacher_id = ? group by student_id', [today, id]);
}