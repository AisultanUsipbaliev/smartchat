let controller = require('../controllers/chart')

module.exports = async function(req, res) {
	try {
		await startLog('chart', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case 'GET': 	result = await controller.getChart(req);			break;
			default: 		result = {status: 405, message: 'invalid method'}; 	break;
		}
		await endLog('chart', result, req.body.myId);
		res.status(result.status).json(result);
	} catch (err) {
		await endLog('chart::ERROR', { err: err.message, route: 'chart' }, req.body.myId);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
} 