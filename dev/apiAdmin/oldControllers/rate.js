const model = require('../models/rate');
let fs = require('fs')

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

	if (req.body.order == 'true') { order = 'desc'; } else if (req.body.order == 'false') { order = 'asc'; }

	let text 	 = '';
	if (typeof(req.body.text) != undefined && req.body.text !== null) { text = req.body.text.trim(); }

	result = await model.getRates(column, order, from, limit, text);  

	return result.length > 0 ? { status: 200, result } : { status: 204 };
}

exports.getRate = async (req) =>
{
	let rate_id = req.body.rate_id || '';
	
	let rate = await model.getRate(rate_id);

	return rate.length > 0 ? { status: 200, rate } : { status: 204 };
}

exports.newRate = async (req) =>
{
	if (typeof(req.body.rate) == undefined && req.body.rate === null) 			{ return { status: 400, message: 'no rate' }; }
	let rate = JSON.parse(req.body.rate)[0];
	if (typeof(rate.rate_name) == undefined && rate.rate_name === null) 			{ return { status: 400, message: 'no rate name' }; }
	if (typeof(rate.rate_content) == undefined && rate.rate_content === null) { return { status: 400, message: 'no rate content' }; }
	if (typeof(rate.rate_title) == undefined && rate.rate_title === null) 		{ return { status: 400, message: 'no rate title' }; }
	if (typeof(rate.lessons) == undefined && rate.lessons === null) 					{ return { status: 400, message: 'no rate lessons' }; }
	if (typeof(rate.rate_cost) == undefined && rate.rate_cost === null) 			{ return { status: 400, message: 'no rate cost' }; }

	let result = null;
	if(rate.rate_id){
		result = await model.updateRate(rate.rate_id, rate.rate_name, rate.rate_content, rate.rate_title, rate.lessons, rate.rate_cost, rate.sale || 0, rate.oldCost, rate.image)
	}else{
		result = await model.insertRate(rate.rate_name, rate.rate_content, rate.rate_title, rate.lessons, rate.rate_cost, rate.sale || 0, rate.oldCost, rate.image)
	}
	return result ? { status: 200 } : { status: 204 };
}

exports.uploadPhoto = async (req) =>{
	console.log('req.body',req.body)
	if(req.files && req.files.uploadFile){
		let fileData = req.files.uploadFile.data;
		let name = req.body.fileName;
		await fs.writeFileSync('./../../files/files/' + name, fileData, 'binary')
	}
	return { status: 200 }
}

exports.changeActivate = async (req) =>
{
	if (typeof(req.body.rate_id) == undefined && req.body.rate_id === null) 		{ return { status: 400, message: 'no rate id' }; }
	if (typeof(req.body.newStat) == undefined && req.body.newStat === null) 		{ return { status: 400, message: 'no sewStat' }; }

	let rate_id = req.body.rate_id;
	let newStat = req.body.newStat;
	let result = await model.changeActivate(rate_id, newStat);

	return { status: 200 }
}