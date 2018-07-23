let SQL = require('../database/query');

exports.SelectedS = async function(data)
{
	return await SQL(`
					select t.id, t.dt, t.name as test_name, l.name as level_name 
					from test t, level l 
					where t.level = l.id 
					and t.teacher = ?
					order by t.dt desc`, 
					[data.index]);
}
exports.SelectedD = async function(data)
{
	return await SQL(`
					select t.id as test_id, t.name as test_name, l.name as level_name, l.id as level_id 
					from test t, level l
					where t.level = l.id 
					and t.id = ? 
					order by t.dt`, 
					[data.test_id]);
}

exports.DeleteTest = async function(data)
{
	return await SQL('delete from test where id = ?', [data.test_id]);
} 