let SQL = require('../database/query');

exports.getGroupsByTeacher = async function(id)
{
	return await SQL('select * from _group where teacher = ? ', id);
}