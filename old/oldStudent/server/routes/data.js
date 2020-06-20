let controller = require('../controllers/data')
module.exports = async function(req, res) {
	try {
		await startLog('data', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");

		let result = null;
		switch (req.body.method.toUpperCase()) {
			case 'NEW_EMAIL': 	result = await controller.newEmail(req);				break;
			case 'REPEAT': 		result = await controller.repeatEmail(req);				break;
			case 'PUSH-TOKEN': 	result = await controller.addPushToken(req);			break;
			default: 			result = { status: 405, message: "INVALID METHOD"}; 	break;
		}
		await endLog('data', result, req.body.myId);
		res.status(result.status).json(result);
	} catch (err) {
		await endLog('data::ERROR', { err: err.message, route: 'data' }, req.body.myId);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
}