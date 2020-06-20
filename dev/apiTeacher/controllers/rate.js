let rateModel = require('../../apiModels/rate')

exports.getRates = async (req) => {
	return {status: 200, rates: await rateModel.getRates()}
}
exports.getRate = async (req) => {
	if(!req.body.rate_id) return {status: 418, message: 'no rate_id'}
	let rate = await rateModel.getRate(req.body.rate_id)
	return rate? {status: 200, rate} : {status: 404}
}