let SQL = require('../modules/query');
module.exports = async function(req, res, next) {

	if(req.cookies.SAI) {
		let teacher = (await SQL('select * from teacher where teacher_id = ? and pass = ?' , [req.cookies.SAI, req.cookies.SAP]))[0]
		if(!teacher) { res.render('./../../views/account/login', {version: config.version}); return; }
		if(teacher.activated) next()
		else res.render('./../../views/account/notactivated', {version: config.version})
	}
	else next();
}