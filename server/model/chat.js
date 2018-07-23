let SQL = require('../database/query');

exports.getChat = async function(group)
{
	return await SQL('select * from chat where _group = ?', group);
}

exports.readChat = async function(group, id)
{
	return await SQL(`delete from unreadMes 
						where user = ? 
						and message in 
						(select id from chat where isteacher = 0 and _group = ?)`, 
						[id, group]);
}

exports.getMissedChats = async function(id)
{
	return await SQL(`
					select g.id, count(u.id) 
					from smartEdu._group g
					join smartEdu.chat c on c._group = g.id
					join smartEdu.unreadMes u on c.id = u.message
					where g.teacher = ? and c.isteacher = 0;
					`,id);
}