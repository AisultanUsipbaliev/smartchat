const logModel = require('../../apiModels/log')

exports.getLogs = async (req) => {
	if (!parseInt(req.body.filter) && parseInt(req.body.filter) !== 0) 	return { status: 400, message: 'no filter' }
	if (!parseInt(req.body.order) && parseInt(req.body.order) !== 0) 	return { status: 400, message: 'no order' }
	if (!parseInt(req.body.id) && parseInt(req.body.id) !==0) 			return { status: 400, message: 'no id' }
	if (!parseInt(req.body.limit) && parseInt(req.body.limit) !== 0) 	return { status: 400, message: 'no limit' }

	let filter 	= parseInt(req.body.filter),
		order 	= parseInt(req.body.order),
		id 		= parseInt(req.body.id),
		limit 	= parseInt(req.body.limit),
		text 	= '',
		logs 	= '';

	if (req.body.text && (typeof req.body.text) === "string") { text = req.body.text.trim() }

	if (filter == 1) 		logs = await logModel.getFilteredLogs(order, id, limit, 0, text);
	else if (filter == 2) 	logs = await logModel.getFilteredLogs(order, id, limit, 1, text);
	else 					logs = await logModel.getAllLogs(order, id, limit, text);

	if(logs.length) 		return { status: 200, data: logs }
	else 					return { status: 204 }
}
exports.deleteLog = async (req) => {
	let data = null;

	try {
		data = JSON.parse(req.body.data)
		if(!Array.isArray(data)) return { status: 418, message: 'invalid data' }
	} catch (e) {
		return { status: 418, message: 'invalid data' }
	}

	let result = true;
	for (let i = 0; i < data.length; i++) {
		let res = await logModel.remove(data[i].id)
		if (!res) { result = false }
	}

	return result ? { status: 200 } : { status: 400 };
}