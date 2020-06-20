let configModel = require('../../apiModels/config'),
	teacherModel = require('../../apiModels/teacher')

module.exports = async (req, res) => {
	if(req.cookies.DOS) {

		let sConfig = await configModel.getConfig()

		if(sConfig.pass == req.cookies.DOS) {

			let list = await teacherModel.getList()
			res.status(200).json(list)

		} else res.sendStatus(401)
	} else res.sendStatus(401)
}