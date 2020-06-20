let groupModel = require('../../apiModels/group')

exports.getGroups = async (req) => {
	return { status: 200, groups: await groupModel.getGroups(req.body.myId) }
}