const SQL = require('../database/query');

exports.getStudent = async function(id) {
	return (await SQL('select * from student where student_id = ?', id))[0]
}

exports.getTeacher = async function(id) {
	return (await SQL('select * from teacher where teacher_id = ?', id))[0];
}

exports.feedSmart = async function(student, comment, value)
{
	let res = await SQL('insert into feedback(student, com, value) values (?,?,?)', [student, comment, value]);
	return res.affectedRows > 0 ? res.insertId: false; 
}

exports.deleteSmart = async function(student)
{
	return (await SQL('delete from needFeedback where student = ? and teacher = 0', student)).affectedRows>0 ? true:false;
}

exports.feedTeacher = async function(teacher, student, comment, value)
{
	let res = await SQL('insert into rating(teacher_id, student_id, com, value) values (?,?,?,?)', [teacher, student, comment, value]);
	return res.affectedRows > 0 ? res.insertId: false; 
}

exports.deleteTeacher = async function(teacher, student)
{
	return (await SQL('delete from needFeedback where student = ? and teacher = ?', [student, teacher])).affectedRows>0 ? true:false;
}

exports.sendReport = async function(id, comment, file)
{
	if(file) 
		return (await SQL('insert into report(user, com, file) values(?,?,?)', [id, comment, file])).affectedRows>0 ? true:false;
	else 
		return (await SQL('insert into report(user, com) values(?,?)', [id, comment])).affectedRows>0 ? true:false;
}