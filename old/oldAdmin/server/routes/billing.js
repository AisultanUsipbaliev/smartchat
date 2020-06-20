const controller = require('../controllers/billing');

module.exports = async (req, res) =>
{
	try 
	{
		startLog('billing', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");

		let result = null;
		switch (req.body.method.toUpperCase())
		{
			case 'GET-BILLING': result = await controller.getAll(req);								break;
			case 'GET-INFO': 		result = await controller.getInfo(req);								break;
			default: 						result = { status: 405, message: "INVALID METHOD"}; 	break;
		}
		endLog('billing', result);
		res.status(result.status).json(result);
	}
	catch (err)
	{
		endLog('billing::ERROR', err);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
} 