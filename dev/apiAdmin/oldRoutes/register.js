const controller = require('../controllers/register');

module.exports = async (req, res) =>
{
	try 
	{
		startLog('register', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");

		let result = null;
		switch (req.body.method.toUpperCase())
		{
			case 'READ': 		result = await controller.Read(req);								break;
			case 'DELETE': 	result = await controller.Delete(req);							break;
			default: 				result = { status: 405, message: "INVALID METHOD"}; break;
		}
		endLog('register', result);
		res.status(result.status).json(result);
	}
	catch (err)
	{
		endLog('register::ERROR', err);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
} 