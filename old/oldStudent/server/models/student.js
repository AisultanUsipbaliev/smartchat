let SQL = require('../database/query');

exports.getProfile = async function(id) {
	return (await SQL(`SELECT firstname, lastname, phone, ava, birthday, lvl.lvl_name, group_id, smsOn, mailOn 
						FROM student
						JOIN lvl on lvl.lvl_id = student.lvl WHERE student_id = ?`, id))[0];
}

exports.getTeacherByGroupId = async function(group) {
	return (await SQL('select login, lastname from teacher t join gr g on g.teacher_id = t.teacher_id where g.group_id = ?', group))[0]
} 

exports.getMyRate = async function(group) {
	return (await SQL('select * from rate r join gr g on g.rate_id = r.rate_id where g.group_id = ?', group))[0]
}

exports.getFinishedCourses = async function(id) {
	return(await SQL('select * from rate r join finishedCourses fc on fc.course = r.rate_id where fc.student = ?', id))[0]
}

///
exports.updateProfile= async function(id, firstname, lastname, birthday) {
	let result = await SQL('UPDATE student SET firstname = ?, lastname = ?, birthday = ? WHERE student_id = ?', [firstname, lastname, birthday, id]);
	if(result.affectedRows > 0) return true;
	else						return false;
}
///
exports.deleteProfile= async function(id) {
	let result = await SQL('DELETE FROM student WHERE student_id = ?', id);
	if(result.affectedRows > 0) return true;
	else						return false;
}
///
exports.getStudentInfoById = async function(id) {
	return (await SQL('select * from student where student_id = ?', id))[0];
}
///
exports.updatePassword = async function(id, pass) {
	let result = await SQL('update student set pass = ? where student_id = ?', [pass, id]);
	if(result.affectedRows > 0) return true;
	else 						return false;
}
