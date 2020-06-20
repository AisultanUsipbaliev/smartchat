let SQL = require('../modules/query');

exports.addTeacher = async function(login, lastname, phone, pass, email) {
	let inserted = await SQL('insert into teacher(login, lastname, phone, pass, email) values (?,?,?,?,?)',
		[login, lastname, phone, pass, email]);

	if(inserted.affectedRows > 0) 	return inserted.insertId;
	else 							return false;
}

exports.getTeacherInfoByEmail = async function(email) {
	return (await SQL('select * from teacher where email = ?', email))[0];
}

exports.updateEmailCode = async function(id, code) {
	return (await SQL('update teacher set emailCode = ? where teacher_id = ?', [code, id])).affectedRows > 0?  1:0;
}

exports.deleteTeacher = async function(id) {
	return (await SQL('delete from teacher where teacher_id = ?', id)).affectedRows> 0? 1:0;
}

exports.getTeacher = async function(id) {
	return (await SQL('select * from teacher where teacher_id = ?', id))[0];
}