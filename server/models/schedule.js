let SQL = require('../database/query');

exports.SelectedS = async function(data)
{
	return await SQL('select * from chart where _group in (select id from _group where teacher = ? )',
					[data.index]);
}
exports.SelectedD = async function(data)
{
	return await SQL(`
					select g.type, g.name, g.id, c.day, c.start, c.finish, l.name 
					from chart c, student s, lvl l, _group g 
					where c.day = ? 
					and g.id = c._group 
					and s._group = g.id 
					and s.level = l.id 
					and g.id in (select id from _group where teacher = ? )
					group by g.id 
					order by c.start`,
					[data.day, data.index]);
}
exports.AllChart = async function(data)
{
	return await SQL('select * from chart where _group in (select id from _group where teacher = ? )', 
					[data.index]);
}
exports.Graph = async function(data)
{
	return await SQL('select * from graph where teacher = ?', [data.index]);
}
  