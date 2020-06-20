let startLog 	= require('../log').startLog
let endLog		= require('../log').endLog
let controller 	= require('../controllers/account')
	
module.exports = async(req, res) => {
	try {
		let result = null
		await startLog('account', req.body)

		if(!req.body.method) result = {status: 405, message: 'no method'}
		if(!result) switch (req.body.method.toUpperCase()) {
			case 'REGISTRATION': 			
				result = await controller.addTeacher(req)
				if (result.status==200) {
					res.cookie('SAI', result.id,			{ maxAge: 31104000000 });
					res.cookie('SAN', result.login,			{ maxAge: 31104000000 });
					res.cookie('SAT', result.email,			{ maxAge: 31104000000 });
					res.cookie('SAP', result.password,		{ maxAge: 31104000000 });
					res.cookie('SAA', result.phone,			{ maxAge: 31104000000 });
				}
			break;
			case 'VERIFY': result = await controller.verifyTeacher(req);		break;
			case 'PASSWORD': result = await controller.updatePassword(req);		break;
			case 'GET-COUNTRIES': result = await controller.getCountries(req);	break;
			case 'FIND-COUNTRIES': result = await controller.findCountry(req);	break;
			case 'SMS': result = await controller.sendSMS(req);					break;
			case "LOGIN": 					
				result = await controller.loginTeacher(req)
				if (result.status==200 || result.status==303) {
					res.cookie('SAI', result.id,			{ maxAge: 31104000000 });
					res.cookie('SAN', result.login,			{ maxAge: 31104000000 });
					res.cookie('SAT', result.email,			{ maxAge: 31104000000 });
					res.cookie('SAP', result.password,		{ maxAge: 31104000000 });
					res.cookie('SAA', result.phone,			{ maxAge: 31104000000 });
					if(result.status==303)			{ await controller.sendSMS(req) };
				}
			break;
			case 'LOGOUT':
				res.clearCookie('SAI')
				res.clearCookie('SAN')
				res.clearCookie('SAT')
				res.clearCookie('SAP')
				return res.sendStatus(200)
			break;
			default: result = { status: 405, message: "INVALID METHOD"};   	   break;			
		}

		await endLog('account', result, req.body.myId)
		res.status(result.status).json(result)

	} catch (err) {
		console.log(err)
		await endLog('account::error', { err: err.message, route: 'account', data: req.body }, req.body.myId)
		res.status(404).json({err: 'Ошибка на сервере'})
	}
}
