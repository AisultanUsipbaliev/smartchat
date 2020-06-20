let SQL = require('../database/query');

exports.addStudent = async function(phone, password, firstname, timeDiff) {
	let inserted = await SQL('INSERT INTO student (phone, pass, firstname, timeDifference) VALUES (?,?,?, ?)',
		[phone, password, firstname, timeDiff]);

	if(inserted.affectedRows > 0) 	return inserted.insertId;
	else 							return false;
}

exports.addSocial = async function(firstname, lastname, socialId, token, type) {
	let inserted = await SQL('insert into student (firstname, lastname, socialId, socialToken, socialType, smsOn, mailOn) values (?, ?, ?, ?, ?, 0, 0)', 
		[firstname, lastname, socialId, token, type])
	if(inserted.affectedRows > 0) 	return inserted.insertId;
	else 							return false;
}

exports.deleteStudent = async function(id)
{
	return (await SQL('delete from student where student_id = ?', id)).affectedRows > 0 ? true : false;
}

exports.addData = async function(student_id, firstname, lastname, email, age)
{
	return (await SQL('update student set firstname = ?, lastname = ?, email = ?, age = ? where student_id = ?', 
		[firstname, lastname, email, age, student_id])).affectedRows > 0 ? true : false;
}

exports.updateEmail = async function(id, email)
{
	return (await SQL('update student set email = ? where student_id = ?', 
		[email, id])).affectedRows > 0 ? true : false;
}

exports.updateEmailCode = async function(id, code)
{
	return (await SQL('update student set emailCode = ? where student_id = ?', [code, id])).affectedRows > 0? true : false;
}

exports.getStudentInfoByPhone = async function(phone)
{
	return (await SQL('select * from student where phone = ?', phone))[0];
}

exports.getStudent = async function(id) {
	return (await SQL('select * from student where student_id = ?', id))[0];
}

exports.getStudentInfoByEmail = async function(email) {
	return (await SQL('select * from student where email = ?', email))[0];
}

exports.getStudentBySoc = async function(sid, type) {
	return (await SQL('select * from student where socialId = ? and socialType = ?', [sid, type]))[0]
}

exports.updateToken = async function(id, token) {
	return (await SQL('update student set socialToken = ? where student_id = ?', [ token, id ])).affectedRows > 0? true : false
}

exports.getAuthId = async function (phone) {
	return (await SQL('SELECT auth_id FROM student WHERE phone = ?', [phone]))[0].auth_id;
}

exports.setActive = async function (phone, is_active) {
	if(!is_active) console.log('is_active is undefined');
	let updated = await SQL('UPDATE student SET is_active = ? WHERE phone =?', [is_active, phone]);

	if(updated.affectedRows > 0) 	return true;
	else 							return false;
}

exports.updateCode= async function(phone, code)  {
	let updated = await SQL('update student set auth_id = ? where phone = ?', [code, phone]);
	if(updated.affectedRows > 0) 	return true;
	else 							return false;
}

exports.updatePassword = async function(phone, password) {
	let updated = await SQL('update student set pass = ? where phone = ?', [password, phone]);
	if(updated.affectedRows > 0) 	return true;
	else 							return false;
}

exports.addToken = async function(id, token) {
	let tokens = (await SQL('select pushTokens from student where student_id = ?', id))[0].pushTokens;
	let mas;
	if(tokens) {
		mas = JSON.parse(tokens);

		for(let i = 0; i < mas.length; i++) if(mas[i] == token) return true;

		mas.push(token);
	} else {
		mas = [token];
	}
	return (await SQL('update student set pushTokens = ? where student_id = ?', [JSON.stringify(mas), id]))
	.affectedRows > 0 ? true: false
}