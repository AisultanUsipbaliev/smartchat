let model = require('../models/result');

exports.Get = async function(index)
{
	let result = model.Result({index});

	if(result.length)
	{
		for (var i = 0; i < result.length; i++) {
			let isread = await model.IsRead({result: result[i].result_id})
		}
		return {status: 200, result: result[0]};
	}
	else
	{
		return {status: 202, message: 'not found'};
	}
}



 