let controller = require('../controllers/feedback')

module.exports = async function(req, res) {
	try {
		await startLog('feedback', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case 'SMART': 	result = await controller.feedSmart(req);	 			break;
			case 'TEACHER': result = await controller.feedTeacher(req);				break;
			case 'REPORT': 	result = await controller.sendReport(req);				break;
			default:		result = {status: 405, message: 'invalid method'};	break;		
		}
		await endLog('feedback', result, req.body.myId);
		res.status(result.status).json(result);
	} catch (err) {
		await endLog('feedback::ERROR', { err: err.message, route: 'feedback' }, req.body.myId);
		res.status(404).json({ err: 'Ошибка на сервере'});
	}
} 