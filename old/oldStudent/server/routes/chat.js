let controller = require('../controllers/chat');

module.exports = async function(req, res) {
	try {
		await startLog('chat', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case 'GET': 	result = await controller.getChat(req);				break;
			default: 		result = {status: 405, message: 'invalid method'}; 	break;			
		}
		await endLog('chat', result, req.body.myId);
		res.status(result.status).json(result);
	} catch (err) {
		await endLog('chat::ERROR', { err: err.message, route: 'chat' }, req.body.myId);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
} 