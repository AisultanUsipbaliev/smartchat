const rateModel = require('../../apiModels/rate');

const fs = require('fs')

exports.rateStatus = async (req) => {
	if(!req.body.rate_id) return {status: 418, message: 'no rate_id'}
	if(!req.body.status && req.body.status !=0) return {status: 418, message: 'no status'}

	await rateModel.changeActivate(req.body.rate_id, req.body.status)
	return {status: 200}
}

exports.getRates = async (req) => {

	if (req.body.activeRates) {
		let rate  = await rateModel.getRates(); 
		return rate.length ? { status: 200, rate } : { status: 204 };
	}

	if (!req.body.order)   							{ return { status: 400, message: 'no order'  } }
	if (!req.body.from && req.body.from !== 0) 	  	{ return { status: 400, message: 'no from'   } }
	if (!req.body.limit && req.body.limit !== 0)   	{ return { status: 400, message: 'no limit'  } }
	if (!req.body.column && req.body.column !== 0) 	{ return { status: 400, message: 'no column' } }

	let result = null,
		column = parseInt(req.body.column),
		from = parseInt(req.body.from),
		limit = parseInt(req.body.limit),
		order = '',
		text = '';

	if (req.body.order == 'true') { order = 'desc' } else if (req.body.order == 'false') { order = 'asc' }

	if (req.body.text && (typeof req.body.text) === "string") { text = req.body.text.trim() }

	result = await rateModel.getRateList(column, order, from, limit, text);  

	return result.length ? { status: 200, result } : { status: 204 };
}

exports.getRate = async (req) => {
	if (!req.body.rate_id) { return { status: 400, message: 'no rate id' }; }

	let rate = await rateModel.getRate(req.body.rate_id);

	return rate ? { status: 200, rate } : { status: 204 };
}

exports.createOrUpdateRate = async (req) => {

	if (!req.body.rate_content) 	{ return { status: 400, message: 'no rate content' } }
	if (!req.body.rate_title) 		{ return { status: 400, message: 'no rate title' } }
	if (!req.body.rate_cost)		{ return { status: 400, message: 'no rate cost' } }
	if (!req.body.rate_name) 		{ return { status: 400, message: 'no rate name' } }
	if (!req.body.lessons) 			{ return { status: 400, message: 'no lessons' } }

	let result = null;

	if(req.body.rate_id){
		result = await rateModel.updateRate(req.body.rate_id, req.body.rate_name, req.body.rate_content, req.body.rate_title, req.body.lessons, req.body.rate_cost, req.body.sale || 0, req.body.old_cost || null, req.body.image || null)
		return result ? { status: 200 } : { status: 202 };
	}else{
		result = await rateModel.insertRate(req.body.rate_name, req.body.rate_content, req.body.rate_title, req.body.lessons, req.body.rate_cost, req.body.sale || 0, req.body.old_cost || null, req.body.image || null)
		return result ? { status: 200 } : { status: 500 };
	}

}

exports.changeActivate = async (req) => {
	if (!req.body.rate_id) { return { status: 400, message: 'no rate id' } }
	if (!req.body.newStat) { return { status: 400, message: 'no sewStat' } }

	let result = await rateModel.changeActivate(req.body.rate_id, req.body.newStat)

	return result ? { status: 200 } : { status: 204 }
}

exports.deleteRate = async (req) => {
	if (!req.body.rate_id) { return { status: 400, message: 'no rate id' } }

	let result = await rateModel.deleteRate(req.body.rate_id)

	return result ? { status: 200 } : { status: 204 }
}