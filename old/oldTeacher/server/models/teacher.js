let SQL = require('../modules/query');

exports.getTeacherInfoById = async function(teacher_id)
{
	return (await SQL(`	select login, lastname, phone, email, lvl_name, ava 
						from teacher t
						join lvl l on l.lvl_id = t.lvl
						where teacher_id = ?`, teacher_id))[0];
}

exports.updateTeacherInfo = async function(login, lastname, phone, teacher_id) 
{
	let res = await SQL('update teacher set login = ? , lastname = ?, phone = ? where teacher_id = ?',
						[login, lastname, phone, teacher_id]);

	if(res.affectedRows > 0) 	return true;
	else 						return false;
} 

exports.getTeacherPassByTeacherId = async function(teacher_id)
{
	return (await SQL('	select pass from teacher where teacher_id = ?', teacher_id))[0].pass;
}

exports.updateTeacherPass = async function(pass, teacher_id) 
{
	let res = await SQL('update teacher set pass = ? where teacher_id = ?',
						[pass, teacher_id]);

	if(res.affectedRows > 0) 	return true;
	else 						return false;
} 
