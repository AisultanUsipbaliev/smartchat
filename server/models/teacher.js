let SQL = require('../database/query');

exports.Rows = async function(data)
{
	return await SQL(`
					select t.firstname, t.lastname, t.phone, t.email, t.ava 
					from teacher t 
					where t.id = ?`,
					[data.index]);
}
exports.Updated = async function(data)
{
	return await SQL('update teacher set firstname = ? , lastname = ?, phone = ? where id = ?', 
					[data.login, data.lastname, data.phone, data.index]);
}
exports.RowsPass = async function(data)
{
	return await SQL('select pass from teacher where id = ?', [data.index]);
}
exports.UpdatedPass = async function(data)
{
	return await SQL('update teacher set pass = ? where id = ?',
					[data.pass, data.index]);
}



 

















