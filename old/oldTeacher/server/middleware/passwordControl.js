let SQL = require('../modules/query');

module.exports = async function(req, res, next) {
	if(req.cookies.SAP && req.cookies.SAT) {
		let select = await SQL('select * from teacher where email = ? and pass = ?', [req.cookies.SAT, req.cookies.SAP]);
		if(select.length < 1) {
			res.clearCookie('SAP');
			res.clearCookie('SAI');
			res.clearCookie('SAT');
			res.clearCookie('SAN');
			res.render('./../../views/account/login',{version: config.version});
		}
		else next();
	} else {
		res.clearCookie('SAP');
		res.clearCookie('SAI');
		res.clearCookie('SAT');
		res.clearCookie('SAN');
		next();
	}
}

