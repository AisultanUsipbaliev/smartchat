let SQL = require('../apiFunctions/query')

// select 
	exports.getLevels = async () =>	{
		return await SQL('select * from lvl where lvl_id != 8')
	}
	exports.getLevel = async (id) =>	{
		return (await SQL('select * from lvl where lvl_id = ?', [id]))[0]
	}
	exports.getAllLevels = async () => {
		return await SQL(`select * from lvl`);
	}
// insert

// update

// delete