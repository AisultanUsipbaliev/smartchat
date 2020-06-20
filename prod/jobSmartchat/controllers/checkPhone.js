let teacherModel = require('../../apiModels/teacher')

module.exports = async (req, res) => {
	try {
		console.log(req.body)
		if(!req.body.phone) return res.sendStatus(418)

		let teacher = await teacherModel.findPhone(req.body.phone)
		if(teacher) res.sendStatus(202)
		else		res.sendStatus(200)

	} catch(err) {
		console.error(err)
		sayMe('jobSmartchat/checkPhone', {}, err.message)
		res.sendStatus(405)
	}
}