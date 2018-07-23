let model = require('../models/level');

exports.Get = async function()
{
	let selected = model.selectLvl();

	if(selected[0].length>0)
	{
		return {status: 200, body: selected[0]}
	}
	else
	{
		return {status: 202, message: 'empty'}
	}
}
exports.GetFt = async function(index)
{
	let selected = model.selectedLvl({index});

	if(selected[0].length>0)
	{
		return {status: 200, body: selected[0]}
	}
	else
	{
		return {status: 202, message: 'empty'}
	}
}



