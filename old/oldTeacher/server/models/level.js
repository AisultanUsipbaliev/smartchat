let SQL = require('../modules/query');

exports.getLevel = async function()
{
	return await SQL('select * from lvl');
}
 





