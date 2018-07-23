let SQL = require('../database/query');

exports.Selected = async function(data)
{
	return await SQL('select * from notice where user = ?', [data.index]);
}
exports.SelectReq = async function(data)
{
	return await SQL('select * from request group by student having teacher = ?', [data.index]);
}
exports.SelectSms = async function(data)
{
	return await SQL(`select * from smartEdu.unreadMes u
						join smartEdu.chat c on c.id = u.message
						where u.user = ? 
						and c.isteacher = 0`, [data.index]);
}
exports.SelectTests = async function(data)
{
	return await SQL('select id from result where test in (select id from test where teacher = ?) and isread = 0', 
					[data.index]);
}
exports.Deleted = async function(data)
{
	return await SQL('delete from notice where user = ?', [data.index]);
}
exports.SelectGraph = async function(data)
{
	return await SQL('select * from graph where teacher = ? ', [data.index]);
}



