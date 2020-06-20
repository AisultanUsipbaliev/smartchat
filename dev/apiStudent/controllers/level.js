let levelModel = require('../../apiModels/level')

exports.getLevels = async (req) => {
	let levels = await levelModel.getLevels()
	return { status: 200, levels }
}