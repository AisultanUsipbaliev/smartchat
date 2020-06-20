const controller = require('../controllers/account');

module.exports = async (req, res) =>
{
	try
	{
		startLog('account', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");

		let result = null;
		switch (req.body.method.toUpperCase())
		{
			case 'SIGN': 	
				result = await controller.Sign(req);
				if(result.status == 200) { req.session.sid = 1 }
			break;
			case 'PATCH-PASS': 		result = await controller.ChangePass(req);					break;
			case 'GET-CONFIG': 		result = await controller.GetConfig(req);						break;
			case 'UPDATE-CONFIG': result = await controller.UpdateConfig(req);				break;
			default: 							result = { status: 405, message: "INVALID METHOD"}; break;
		}
		endLog('account', result);
		res.status(result.status).json(result);
	}
	catch (err)
	{
		endLog('account::ERROR', err);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
}