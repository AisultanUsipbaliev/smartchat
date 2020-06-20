const chartModel = require('../../apiModels/chart');

exports.getChart = async function(req) {
	if(req.body.end && req.body.begin) {
		let chart = await chartModel.getStudentChartBeetween(req.body.myId, req.body.begin, req.body.end)
		return chart.length > 0 ? { status: 200, chart } : { status: 202, message: "empty" }
	} else {
		let chart = await chartModel.getStudentChart(req.body.myId)
		return chart.length > 0 ? { status: 200, chart } : { status: 202, message: "empty" }
	}
}