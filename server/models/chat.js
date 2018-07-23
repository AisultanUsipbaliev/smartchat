let SQL = require('../database/query');

exports.selectChatS = async function(data)
{
	return await SQL('select * from chat where _group in (select id from _group where teacher = ?) ', 
					[data.index]);
}
exports.selectChatD = async function(data)
{
	return await SQL(`	select c._group, c.sender, c.dt, c.content, c.title, c.type, c.isteacher, s.firstname 
						from chat c 
						left join student s on c.sender = s.id 
						where  c._group = ? 
						and c._group in (select id from _group where teacher = ?) order by dt`, 
						[data.group_id, data.index]);
}
exports.chatIsRead = async function(data)
{
	return await SQL('update chat set isread = 1 where _group = ?', 
					[data.group_id]);
}
exports.selectGrS = async function(data)
{
	return await SQL('select * from _group where teacher = ? and group in (select _group from studentGroup)', 
					[data.index]);
}
exports.selectGrD = async function(data)
{
	return await SQL('select * from _group where teacher = ? and id = ?', 
					[data.index, data.group_id]);
}
exports.countMiss = async function(id)
{
	return await SQL(`	select g.id, count(u.id) as count 
						from smartEdu.chat c 
						join smartEdu._group g on  c._group = g.id
						join smartEdu.unreadMes u on u.message = c.id
						where u.user = ${id}
						and c.isteacher = 1
						and g.teacher = ${id}
						`);
}


















