let SQL = require('../database/query');

exports.Groups = async function(data)
{
	return await SQL(`	select count(s.id) as quantity, g.id, g.name 
						from _group g 
						join student s on s._group = g.id 
						where g.teacher = ? 
						and g.type = 0 
						group by g.id`, 
					[data.index]);
}
exports.Students = async function(data)
{
	return await SQL('select firstname, lastname, id from student s where  s._group = ?', [data.group_id]);
}
exports.Group = async function(data)
{
	return await SQL('update _group set name = ? where id = ?', [data.name, data.id]);
}
exports.DelGroup = async function(data)
{
	return await SQL('delete from _group where id = ?', [data.id]);
}


