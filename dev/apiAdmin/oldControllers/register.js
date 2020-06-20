const model = require('../models/register');

exports.Read = async (req) =>
{
	if (parseInt(req.body.filter) == NaN) return { status: 400 }
	if (parseInt(req.body.order) == NaN) 	return { status: 400 }
	if (parseInt(req.body.id) == NaN) 		return { status: 400 }
	if (parseInt(req.body.limit) == NaN) 	return { status: 400 }

	let filter 	= parseInt(req.body.filter);
	let order 	= parseInt(req.body.order);
	let id 			= parseInt(req.body.id);
	let limit 	= parseInt(req.body.limit);

	let text 	 = '';
	if (typeof(req.body.text) != undefined && req.body.text !== null) { text = req.body.text.trim(); }

	let logs = '';

	if (filter == 1) 			logs = await model.getFilteredLogs(order, id, limit, 0, text);
	else if (filter == 2) logs = await model.getFilteredLogs(order, id, limit, 1, text);
	else 									logs = await model.getAllLogs(order, id, limit, text);

	if(logs.length > 0) 	return { status: 200, data: logs };
	else 									return { status: 204 };
}
exports.Delete = async (req) =>
{
	if(!req.body.id) return { status: 418, message: 'no id' };

	let res = await model.removeLog(req.body.id);

	return res ? { status: 200 } : { status: 400 };
}