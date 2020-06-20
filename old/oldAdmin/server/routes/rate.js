const controller = require('../controllers/rate');

module.exports = async (req, res) =>
{
	try 
	{
		startLog('rate', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");

		let result = null;
		switch (req.body.method.toUpperCase())
		{
			case 'GET-ALL-RATES': 		result = await controller.getAll(req);								break;
			case 'GET-RATE': 					result = await controller.getRate(req);								break;
			case 'NEW-RATE': 					result = await controller.newRate(req);								break;
			case 'CHANGE-ACTIVATE': 	result = await controller.changeActivate(req);				break;
			case 'DELETE-RATE': 			result = await controller.deleteRate(req);						break;
			case 'UPLOAD-PHOTO': 			result = await controller.uploadPhoto(req);						break;
			default: 									result = { status: 405, message: "INVALID METHOD"}; 	break;
		}
		endLog('rate', result);
		res.status(result.status).json(result);
	}
	catch (err)
	{
		endLog('rate::ERROR', err);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
} 