let controller = require('../controllers/graph')
module.exports = async function(req, res) {
	try {
		startLog('graph', {body: req.body, index: req.cookies.SAI});
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case "GET": 	result = await controller.getGraph(req);				break;
			case 'POST': 	result = await controller.createGraph(req); 			break;
			default: 		result = { status: 405, message: "INVALID METHOD"}; 	break;			
		}
		endLog('graph', result);
		res.status(result.status).json(result);
	}
	catch (err) {
		await errorLog('graph', {body: req.body, index: req.cookies.SAI}, err)
		res.status(404).json({err: 'Ошибка на сервере'});
	}
}