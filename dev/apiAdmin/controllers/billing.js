const paymentModel = require('../../apiModels/payment');

exports.getBillings = async (req) => {
	if (!req.body.order) 		  					{ return { status: 400, message: 'no order'  }; }
	if (!req.body.column && req.body.column !== 0) 	{ return { status: 400, message: 'no column' }; }
	if (!req.body.from && req.body.from !== 0) 		{ return { status: 400, message: 'no from'   }; }
	if (!req.body.limit && req.body.limit !== 0) 	{ return { status: 400, message: 'no limit'  }; }

	let result = null;

	let column = parseInt(req.body.column),
		from 	 = parseInt(req.body.from),
		limit	 = parseInt(req.body.limit),
		text 	 = '',
		order = '';

	if (req.body.order == 'true') { order = 'desc'; } else if (req.body.order == 'false') { order = 'asc'; }

	if (req.body.text && (typeof req.body.text) === "string") { text = req.body.text.trim(); }

	result = await paymentModel.getBilling(column, order, from, limit, text, req.body.start, req.body.end)

	return result.length ? { status: 200, result } : { status: 204 }
}
exports.paymentStatistics = async (req) => {
	
	if(!req.body.start && !req.body.end) {
		let info = await paymentModel.getAll();
		return info ? { status: 200, data: info[0] } : { status: 204 }
	}

	if (typeof(req.body.start) == undefined && req.body.start === null) { return { status: 400, message: 'no start' } }
	if (typeof(req.body.end) == undefined && req.body.end === null) 	{ return { status: 400, message: 'no end' } }

	let info = await paymentModel.getAll(parseInt(req.body.start), parseInt(req.body.end));

	return info ? { status: 200, data: info[0] } : { status: 204 };
}