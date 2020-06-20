let controller = require('../controllers/group');

module.exports = async function(req, res) {
	try {
		startLog('group', {body: req.body, index: req.cookies.SAI});
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case "GET": 	result = await controller.getGroup(req);				break;
			case 'POST': 	result = await controller.updateGroup(req); 			break;
			case 'DELETE': 	result = await controller.deleteGroup(req); 			break;
			default: 		result = { status: 405, message: "INVALID METHOD"}; 	break;			
		}
		endLog('group', result);
		res.status(result.status).json(result);
	}
	catch (err) {
		await errorLog('group', {body: req.body, index: req.cookies.SAI}, err)
		res.status(404).json({err: 'Ошибка на сервере'});
	}
}
 