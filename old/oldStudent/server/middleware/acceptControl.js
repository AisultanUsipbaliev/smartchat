let studentModel = require('../model/student')

module.exports = async function(req, res, next) {
    if(req.body.myId && req.cookies.SAI) {

    	let student = await studentModel.getStudent(req.body.myId)
    	if(student.blocked) { res.clearCookie('SAP'); res.clearCookie('SAI'); res.clearCookie('SAU'); res.clearCookie('SI'); res.clearCookie('ST');}
    	
    	next();
    }
	else 
		if(req.cookies.MMM) res.render('./../../mobile/views/account/sign', {version: config.version});
		else 				res.render('./../../web/views/account/sign', {version: config.version});
}