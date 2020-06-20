let bcrypt 			= require('bcrypt')
let path 			= require('../path')
let translate 		= require("../translator")
let studentModel 	= require('../../apiModels/student')

module.exports = async function(req, res, next) {
	if(req.body.myId) {

		let student = await studentModel.getStudent(req.body.myId)

		if(student.blocked) { 

			res.clearCookie('SAP') 
			res.clearCookie('SAI') 
			res.clearCookie('SAU') 
			res.clearCookie('SI') 
			res.clearCookie('ST')
			res.sendStatus(403)
			return
		}


		if(req.method == 'GET' && student.pass && false) {
			// if(!student.pass) 
				// return next()
			// res.render(path.newpass, {version: config.version, strings: await translate('restore', req.cookies.SAL)})

			if(await bcrypt.compare('smartchat', student.pass)) 
				return res.render(path.newpass, {version: config.version, strings: await translate('restore', req.cookies.SAL)})
		}
			
		next()
		
	}
	else res.redirect('/login')
}