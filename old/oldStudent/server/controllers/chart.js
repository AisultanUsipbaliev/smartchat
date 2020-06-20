const model = require('../models/chart');

exports.getChart = async function(req) {
	if(!req.body.end) 		return {status: 418, message: 'no end'}
	if(!req.body.begin) 	return {status: 418, message: 'no begin'}

	let chart = await model.getChart(req.body.myId, req.body.begin, req.body.end)

	if (chart.length > 0) 	return { status: 200, message: "success", body: chart }
	else 					return { status: 202, message: "chart is empty" }
}