let configModel = require('../../apiModels/config')

module.exports = async (req, res) => {
	let sConfig = await configModel.getConfig()	
	req.cookies.DOS == sConfig.pass? res.sendStatus(200) : res.sendStatus(401)
}