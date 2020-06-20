let levelModel = require('../../apiModels/level')

exports.getLevels = async (req) => {
	return { status:200, levels: await levelModel.getLevels() }
}