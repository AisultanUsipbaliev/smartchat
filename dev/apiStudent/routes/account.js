let controller 	= require('../controllers/account')
let startLog 	= require('../functions/log').startLog
let endLog		= require('../functions/log').endLog
	
module.exports = async function(req, res) {
	try {
		let result = null
		await startLog('account', req.body)
		console.log(req.body)
		if(!req.body.method) result = {status: 405, message: 'no method'}
		if(!result) switch (req.body.method.toUpperCase()) {
			case 'LOGOUT':
				res.clearCookie('SAP'); res.clearCookie('SAI'); 
				res.clearCookie('SAU'); res.clearCookie('SI'); 
				res.clearCookie('ST'); res.clearCookie('STO'); 	
				res.sendStatus(200)				
				return
			case 'COUNTRIES': 				result = await controller.getCountries(req); 			break;
			case 'FIND': 					result = await controller.findCountry(req); 			break;
			case 'VERIFY': 					result = await controller.verifyStudent(req);			break;
			case 'SMS': 					result = await controller.sendSMS(req);					break;
			case 'PASSWORD': 				result = await controller.updatePassword(req); 			break;
			case 'VK-URL': 					result = await controller.vkURL(req); 					break;
			case 'MAIL-URL': 				result = await controller.mailURL(req); 				break;
			case 'STRINGS': 				result = await controller.getStrings(req); 				break;
			case 'SOCIAL': 
				result = await controller.authSocial(req);
				if (result.status==200) {
					res.cookie('SI', 	result.SI, 		{ maxAge: 31104000000 })
					res.cookie('ST', 	result.ST, 		{ maxAge: 31104000000 })
					res.cookie('SAI', 	result.SAI, 	{ maxAge: 31104000000 })
					res.cookie('STO', 	result.STO,		{ maxAge: 31104000000 })
				}				
			break;
			case "LOGIN": 					
				result = await controller.loginStudent(req)
				if(result.status==303) await controller.sendSMS(req)
				if (result.status==200 || result.status==303) {
					res.cookie('SAU', result.phone, 	{ maxAge: 31104000000 });
					res.cookie('SAP', result.password, 	{ maxAge: 31104000000 });
					res.cookie('SAI', result.id, 		{ maxAge: 31104000000 });
				}
			break;
			case 'REGISTRATION': 			
				result = await controller.addStudent(req)
				if (result.status==200) {
					res.cookie('SAU', result.phone, 	{ maxAge: 31104000000 })
					res.cookie('SAP', result.password, 	{ maxAge: 31104000000 })
					res.cookie('SAI', result.id, 		{ maxAge: 31104000000 })
				}
			break;
			default: result = { status: 405, message: "INVALID METHOD"}; break;			
		}
		console.log('answer', result)
		await endLog('account', result, req.body.myId)
		res.status(result.status).json(result)

	} catch (err) {
		console.log(err)
		await endLog('account::ERROR', { err: err.message, route: 'account', data: req.body }, req.body.myId)
		res.status(404).json({err: 'Ошибка на сервере'})
	}
}