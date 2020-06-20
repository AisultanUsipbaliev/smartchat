let controller = require('../controllers/schedule');

module.exports = async function(req, res) {
	try {
		startLog('schedule', {body: req.body, index: req.cookies.SAI});
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");

		let result = null;
		switch (req.body.method.toUpperCase()) {
			case "GET": 		result = await controller.getChart(req);			break;
			case 'GET-FULL': 	result = await controller.getFullChart(req); 		break;
			default: 			result = { status: 405, message: "INVALID METHOD"}; break;			
		}
		endLog('schedule', result);
		res.status(result.status).json(result);
	}
	catch (err) {
		await errorLog('schedule', {body: req.body, index: req.cookies.SAI}, err)
		res.status(404).json({err: 'Ошибка на сервере'});
	}
}