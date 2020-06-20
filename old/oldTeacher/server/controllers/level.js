let model = require('../models/level');

exports.getLevel = async function ()
{	
	let level = await model.getLevel();

	if(level.length > 0) 			return {status: 200, message: 'success', body: level};
	else 							return {status: 202, message: 'empty'};
}
