let controller = require('../controllers/test');

module.exports = async function(req, res) {
	try {
		startLog('test', {body: req.body, index: req.cookies.SAI});
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case "GET": 	result = await controller.getTest(req);				break;
			case 'POST': 	result = await controller.createOrUpdateTest(req); 	break;
			case 'DELETE': 	result = await controller.deleteTest(req); 			break;
			default: 		result = { status: 405, message: "INVALID METHOD"}; break;			
		}
		endLog('test', result);
		res.status(result.status).json(result);
	}
	catch (err) {
		await errorLog('test', {body: req.body, index: req.cookies.SAI}, err)
		res.status(404).json({err: 'Ошибка на сервере'});
	}
} 