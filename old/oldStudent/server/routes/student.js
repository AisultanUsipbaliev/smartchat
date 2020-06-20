let controller = require('../controllers/student');

module.exports = async function(req, res) {
	try {
		await startLog('student', req.body)
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!")
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case 'PROFILE': 	result = await controller.getProfile(req); 				break;
			case 'PATCH': 		result = await controller.updateProfile(req); 			break;
			case 'DELETE': 		result = await controller.deleteProfile(req); 			break;
			case 'PASSWORD': 	
				result = await controller.updatePassword(req);
				if(result.status == 200) res.cookie('SAP', result.hash, 2, { maxAge: 900000, httpOnly: true });
			break;
			default: 			result = {status: 405, message: 'invalid method'}; 		break;			
		}
		await endLog('student', result, req.body.myId)
		res.status(result.status).json(result)
	} catch (err) {
		await endLog('student::ERROR', { err: err.message, route: 'student' }, req.body.myId)
		res.status(404).json({err: 'Ошибка на сервере'})
	}
} 