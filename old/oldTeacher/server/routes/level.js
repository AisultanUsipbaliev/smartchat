let controller = require('../controllers/level');

module.exports = async function(req, res) {
	try  {
		startLog('level', {body: req.body, index: req.cookies.SAI});
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");

		let result = null;
		switch (req.body.method.toUpperCase()) {
			case 'GET': result = await controller.getLevel(); 					break;
			default: 	result = { status: 405, message: "INVALID METHOD"}; 	break;			
		}
		endLog('level', result);
		res.status(result.status).json(result);
	}
	catch (err) {
		await errorLog('level', {body: req.body, index: req.cookies.SAI}, err)
		res.status(404).json({err: 'Ошибка на сервере'});
	}
}