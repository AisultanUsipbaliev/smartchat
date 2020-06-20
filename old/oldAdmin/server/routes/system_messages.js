const controller = require('../controllers/system_messages');

module.exports = async (req, res) =>
{
	try 
	{
		startLog('system_messages', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");

		let result = null;
		switch (req.body.method.toUpperCase())
		{
			case 'GET-SYSTEM-MESSAGES': 					result = await controller.GetSystemMessages(req);						break;
			case 'UPDATE-SYSTEM-MESSAGE': 				result = await controller.UpdateSystemMessage(req);					break;			
			default: 															result = { status: 405, message: "INVALID METHOD"}; 				break;
		}
		endLog('system_messages', result);
		res.status(result.status).json(result);
	}
	catch (err)
	{
		endLog('system_messages::ERROR', err);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
} 