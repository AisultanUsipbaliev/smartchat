const paymentModel = require('../../apiModels/payment');

exports.getAll = async (req) =>
{
	if (typeof(req.body.column) == undefined && req.body.column === null) 		{ return { status: 400, message: 'no column' }; }
	if (typeof(req.body.order) == undefined && req.body.order === null) 		  { return { status: 400, message: 'no order'  }; }
	if (typeof(req.body.from) == undefined && req.body.from === null) 			  { return { status: 400, message: 'no from'   }; }
	if (typeof(req.body.limit) == undefined && req.body.limit === null) 		  { return { status: 400, message: 'no limit'  }; }

	let result = null;

	let column = parseInt(req.body.column);
	let from 	 = parseInt(req.body.from);
	let limit	 = parseInt(req.body.limit);
	let order = '';
	let start = req.body.start || '';
	let end = req.body.end || '';

	if (req.body.order == 'true') { order = 'desc'; } else if (req.body.order == 'false') { order = 'asc'; }

	let text 	 = '';
	if (typeof(req.body.text) != undefined && req.body.text !== null) { text = req.body.text.trim(); }

	result = await paymentModel.getBilling(column, order, from, limit, text, start, end);  

	return result.length > 0 ? { status: 200, result } : { status: 204 };
}
exports.getInfo = async (req) =>
{
	if(!req.body.start && !req.body.end) {
		let info = await paymentModel.getAll();
		return info ? { status: 200, data: info[0] } : { status: 204 };
	}
	if (typeof(req.body.start) == undefined && req.body.start === null) { return { status: 400, message: 'no start' }; }
	if (typeof(req.body.end) == undefined && req.body.end === null) 		{ return { status: 400, message: 'no end' }; }

	let start = req.body.start;
	let end = req.body.end;
	let info = await paymentModel.getAll(start, end);

	return info ? { status: 200, data: info[0] } : { status: 204 };
}