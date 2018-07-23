let SQL = require('../database/query');

exports.checkTeacher = async function(data)
{
	console.log(data)
	return await SQL('select * from teacher where email = ? and pass = ?', [data.email, data.pass]);
}
exports.createTeacher = async function(data)
{
	return await SQL('insert into teacher(firstname, lastname, phone, pass, email) values(?,?,?,?,?)', 
					[data.login, data.lastname, data.phone, data.pass, data.email]);
}
exports.searchTeacher = async function(data)
{
	return await SQL('select * from teacher where email = ?', [data.email]);
}
