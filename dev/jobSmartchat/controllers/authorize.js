let bcrypt		= require('bcryptjs')
let configModel = require('../../apiModels/config')

module.exports = async (req, res) => {
	try {
		if(!req.body.password) return res.sendStatus(418)
		
		let sConfig = await configModel.getConfig()
		if(await bcrypt.compare(req.body.password, sConfig.pass)) {
			
			res.cookie('DOS', sConfig.pass, { maxAge: 86400000 })
			res.sendStatus(200)
			
		} else res.sendStatus(202)
	} catch(err) {
		console.error(err)
		sayMe('jobSmartchat/authorize', {}, err.message)
		res.sendStatus(405)
	}	
}