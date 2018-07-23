let SQL = require('../database/query');

exports.selectLvl = async function()
{
	return await SQL('select * from level');
}
exports.selectedLvl = async function(data)
{
	return await SQL('select * from level where id not in (select level from test where teacher = ?)', [data.index]);
}



