let controller = require('../controllers/chat')
module.exports = async function(req, res) {
	try {
		startLog('chat', {body: req.body, index: req.cookies.SAI});
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case "GET": 			result = await controller.get(req);						break;
			case 'GET-CHAT': 		result = await controller.getChat(req); 				break;
			case 'GET-MISS': 		result = await controller.getMiss(req); 				break;
			case 'GET-TEST': 		result = await controller.getTest(req); 				break;
			case 'GET-HOMEWORK': 	result = await controller.getHomework(req); 			break;
			default: 				result = { status: 405, message: "INVALID METHOD"}; 	break;			
		}
		endLog('chat', result);
		res.status(result.status).json(result);
	}
	catch (err) {
		await errorLog('chat', {body: req.body, index: req.cookies.SAI}, err)
		res.status(404).json({err: 'Ошибка на сервере'});
	}
}

  