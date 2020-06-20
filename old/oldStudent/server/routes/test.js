let controller = require('../controllers/test') 

module.exports = async function(req, res) {
	try {
		await startLog('test', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case 'GET': 			result = await controller.getTests(req);				break;
			case 'GET-TEST': 		result = await controller.getTest(req); 				break;
			case 'RESULT': 			result = await controller.checkResult(req);				break;
			case 'GET-RESULT': 		result = await controller.getResult(req);				break;
			case 'CHECK':			result = await controller.check(req);					break;
			//Тест на уровень (начальный)
			case 'GET-LEVEL': 		result = await controller.getLevelTest(req); 			break;
			case 'RESULT-LEVEL': 	result = await controller.checkLevelTest(req); 			break;
			default: 				result = {status: 405, message: 'invalid method'}; 	break;
		}
		await endLog('test', result, req.body.myId);
		res.status(result.status).json(result);
	} catch (err) {
		await endLog('test::ERROR', { err: err.message, route: 'test' }, req.body.myId);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
}