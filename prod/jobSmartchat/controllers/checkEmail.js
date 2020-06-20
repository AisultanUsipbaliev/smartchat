let teacherModel = require('../../apiModels/teacher')

module.exports = async (req, res) => {
	try {

		if(!req.body.email) return res.sendStatus(418)

		let teacher = await teacherModel.findEmail(req.body.email)
		if(teacher) res.sendStatus(202)
		else		res.sendStatus(200)

	} catch(err) {
		console.error(err)
		sayMe('jobSmartchat/checkEmail', {}, err.message)
		res.sendStatus(405)
	}
}