let teacherModel = require('../../apiModels/teacher')

module.exports = async function(req, res, next) {
	if(req.cookies.SAP && req.cookies.SAT) {
		let teacher = await teacherModel.authorize(req.cookies.SAT, req.cookies.SAP)
		
		if(!teacher) {
			res.clearCookie('SAP') //pass
			res.clearCookie('SAI') //id
			res.clearCookie('SAT') //email
			res.clearCookie('SAN') // login lastname
			res.clearCookie('SAA') // phone
		}

	} else {
		res.clearCookie('SAP')
		res.clearCookie('SAI')
		res.clearCookie('SAT')
		res.clearCookie('SAN')	
		res.clearCookie('SAA')	
	} 
	
	next()
}