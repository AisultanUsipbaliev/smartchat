let SQL = require('../database/query');

exports.UpdateAva = async function(data)
{
	return await SQL('update teacher set ava = ? where id = ?', 
					[data.path, data.index]);
}
