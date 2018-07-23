let SQL = require('../database/query');

exports.selectGraph = async function(data)
{
	return await SQL('select * from graph where teacher = ? order by nday', 
					[data.index]);
}
exports.selectChart = async function(data)
{
	return await SQL('select * from chart where _group in (select id from _group where teacher = ?)', 
					[data.index]);
}
exports.deletedGraph = async function(data)
{
	return await SQL('delete from graph where teacher = ?', 
					[data.index]);
}
exports.insertedGraph = async function(data)
{
	return await SQL('insert into graph(teacher, start, finish, nday) values (?,?,?,?)',
					[data.index, data.mas, data.mas1, data.mas2]);
}
	
 
