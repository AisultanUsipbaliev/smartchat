let controller = require('../controllers/request')

module.exports = async function(req, res) {
	try {
		await startLog('request', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case 'PERIODS': result = await controller.getTeachersList(req); 	break;
			case 'SEND':	result = await controller.sendRequest(req);			break;
			case 'DELETE': 	result = await controller.deleteRequest(req); 		break;
			case 'QUICKLY': result = await controller.sendQuickly(req); 		break;
			case 'NEAR': 	result = await controller.getNearTime(req);			break;
			case 'CHECK-ID':result = await controller.checkInvoice(req);		break;
			default:		result = {status: 405, message: 'invalid method'};	break;
		}
		await endLog('request', result, req.body.myId);
		res.status(result.status).json(result);
	} catch (err) {
		await endLog('request::ERROR', { err: err.message, route: 'request' }, req.body.myId);
		res.status(404).json({ err: 'Ошибка на сервере'});
	}
}