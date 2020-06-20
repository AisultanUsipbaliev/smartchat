let controller = require('../controllers/notice')

module.exports = async function(req, res) {
	try {
		await startLog('notice', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case 'GET': 	result = await controller.getNotices(req); 				break;
			case 'DELETE': 	result = await controller.deleteNotice(req); 			break;
			case 'UNREAD': 	result = await controller.getUnread(req);				break;
			default: 		result = {status: 405, message: 'invalid method'}; 		break;
		}
		await endLog('notice', result, req.body.myId);
		res.status(result.status).json(result)
	} catch (err) {
		await endLog('notice::ERROR', { err: err.message, route: 'notice' }, req.body.myId);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
}