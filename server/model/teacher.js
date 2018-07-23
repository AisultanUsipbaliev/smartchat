let SQL = require('../database/query');

exports.checkPassword = async function(email, pass)
{
	return (await SQL('select * from teacher where email = ? and pass = ?', [email, pass]))[0];
}

exports.createTeacher = async function(data)
{
	return await SQL('insert into teacher(firstname, lastname, phone, pass, email) values(?,?,?,?,?)', 
					[data.login, data.lastname, data.phone, data.pass, data.email]);
}

exports.getTeacherByEmail = async function(email)
{
	return (await SQL('select * from teacher where email = ?', email))[0];
}