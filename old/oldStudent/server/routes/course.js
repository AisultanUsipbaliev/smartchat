let controller = require('../controllers/course')

module.exports = async function(req, res) {
	try {
		await startLog('course', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case 'GETALL': 		result = await controller.getCourses(req); 			break;
			case 'GET': 		result = await controller.getCourse(req); 			break;
			case 'CHECK-LEVEL': result = await controller.checkMyLevel(req);		break;
			case 'NEED-REQUEST':result = await controller.checkNeedRequest(req); 	break;
			case 'ADD-LEVEL': 	result = await controller.addLevel(req); 			break;
			default:			result = {status: 405, message: 'invalid method'};	break;		
		}
		await endLog('course', result, req.body.myId);
		res.status(result.status).json(result);
	} catch (err) {
		await endLog('course::ERROR', { err: err.message, route: 'course' }, req.body.myId);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
} 