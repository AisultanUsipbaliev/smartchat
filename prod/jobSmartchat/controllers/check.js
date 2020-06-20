let configModel = require('../../apiModels/config'),
	teacherModel = require('../../apiModels/teacher')

module.exports = async (req, res) => {
	if(req.cookies.DOS) {
		if(!req.body.teacher_id) return res.sendStatus(418)

		let sConfig = await configModel.getConfig()
		if(sConfig.pass == req.cookies.DOS) {

			await teacherModel.setChecked(req.body.teacher_id)
			res.sendStatus(200)

		} else res.sendStatus(401)
	} else res.sendStatus(401)
}