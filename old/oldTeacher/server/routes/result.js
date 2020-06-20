let controller = require('../controllers/result');

module.exports = async function(req, res) {
	try {
		startLog('result', {body: req.body, index: req.cookies.SAI});
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case "GET": 			result = await controller.getResult(req); 				break;
			case 'TEST': 			result = await controller.createResult(req); 			break;
			case 'HOMEWORK': 		result = await controller.createHomework(req); 			break;
			case 'GET-HOMEWORK': 	result = await controller.getHomework(req);  			break;
			case 'GET-RESULT': 		result = await controller.getTestResult(req);  			break;
			case 'TAKE-ASSESSMENT': result = await controller.createHomeworkResult(req); 	break;
			default: 				result = { status: 405, message: "INVALID METHOD"};		break;
		}
		endLog('result', result);
		res.status(result.status).json(result);
	}
	catch (err) {
		await errorLog('result', {body: req.body, index: req.cookies.SAI}, err)
		res.status(404).json({err: 'Ошибка на сервере'});
	}
} 