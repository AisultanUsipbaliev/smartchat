let configModel = require('../../apiModels/config')

module.exports = async (req, res) => {
	if(req.cookies.DOS) {
		let sConfig = await configModel.getConfig()
		if(sConfig.pass == req.cookies.DOS) {

			res.render('lists', {})

		} else res.render('index', {})

	} else res.render('index', {})
}