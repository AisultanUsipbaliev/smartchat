let controller = require('../controllers/group')

module.exports = async function(req, res) {
	try {
		await startLog('group', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case 'GET': 	result = await controller.getGroup(req); 			break;
			default: 		result = {status: 405, message: 'invalid method'}; 	break;
		}
		await endLog('group', result, req.body.myId);
		res.status(result.status).json(result)
	} catch (err) {
		await endLog('group::ERROR', { err: err.message, route: 'group' }, req.body.myId);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
} 