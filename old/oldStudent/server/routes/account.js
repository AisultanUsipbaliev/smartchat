let controller = require('../controllers/account')
module.exports = async function(req, res) {
	try {
		await startLog('account', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case 'REGISTRATION': 			
				result = await controller.addStudent(req) 				
				if (result.status==200) {
					res.cookie('SAU', result.phone, 	1, { maxAge: 900000, httpOnly: true })
					res.cookie('SAP', result.password, 	2, { maxAge: 900000, httpOnly: true })
					res.cookie('SAI', result.id, 		3, { maxAge: 900000, httpOnly: true })
				}
			break;
			case 'VERIFY': 					result = await controller.verifyStudent(req); 			break;
			case "LOGIN": 					
				result = await controller.loginStudent(req)
				if (result.status==200) {
					res.cookie('SAU', result.phone, 	1, { maxAge: 900000, httpOnly: true });
					res.cookie('SAP', result.password, 	2, { maxAge: 900000, httpOnly: true });
					res.cookie('SAI', result.id, 		3, { maxAge: 900000, httpOnly: true });
				}
			break;
			case 'SMS': 					result = await controller.sendSMS(req); 				break;
			case 'PASSWORD': 				result = await controller.updatePassword(req); 			break;
			case 'VK-URL': 					result = await controller.vkURL(req); 					break;
			case 'AMO-REG': 				result = await controller.createAmoUser(req); 			break;
			case 'MAIL-URL': 				result = await controller.mailURL(req); 				break;
			
			case 'GOOGLE': 
				result = await controller.authGoogle(req);
				if (result.status==200) {
					res.cookie('SI', 	result.SI, 		1, { maxAge: 900000, httpOnly: true })
					res.cookie('ST', 	result.ST, 		2, { maxAge: 900000, httpOnly: true })
					res.cookie('SAI', 	result.SAI, 	3, { maxAge: 900000, httpOnly: true })
					res.cookie('STO', 	result.STO,	4, { maxAge: 900000, httpOnly: true })
				}				
			break;
			case 'FB': 
				result = await controller.authFb(req);
				if (result.status==200) {
					res.cookie('SI', 	result.SI, 		1, { maxAge: 900000, httpOnly: true })
					res.cookie('ST', 	result.ST, 		2, { maxAge: 900000, httpOnly: true })
					res.cookie('STO', 	result.STO,	4, { maxAge: 900000, httpOnly: true })
					res.cookie('SAI', 	result.SAI, 	3, { maxAge: 900000, httpOnly: true })
				}
			break;
			case 'TG':
				result = await controller.authTg(req);
				if (result.status==200) {
					res.cookie('SI', 	result.SI, 		1, { maxAge: 900000, httpOnly: true })
					res.cookie('STO', 	result.STO,	4, { maxAge: 900000, httpOnly: true })
					res.cookie('ST', 	result.ST, 		2, { maxAge: 900000, httpOnly: true })
					res.cookie('SAI', 	result.SAI, 	3, { maxAge: 900000, httpOnly: true })
				}
			break;

			default: 						result = { status: 405, message: "INVALID METHOD"}; 	break;			
		}
		await endLog('account', result, req.body.myId);
		res.status(result.status).json(result);
	} catch (err) {
		await endLog('account::ERROR', { err: err.message, route: 'account' }, req.body.myId);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
}