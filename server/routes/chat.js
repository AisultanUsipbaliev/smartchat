let controller = require('../controllers/chat');

module.exports = async function(req,res)
{
	if(!req.body.method)
	{
		res.status(405).json({message: 'no method'});
	}
	else
	{
		let result;
		switch(req.body.method)
		{
			case 'GET':
				result = await controller.Get(req.body, req.cookies['SAI']);
				res.status(result.status).json(result);
			break;
			case "GET-CHAT":
				result = await controller.GetChats(req.body, req.cookies['SAI']);
				res.status(result.status).json(result);
			break;
			case 'GET-MISS':
				result = await controller.GetMiss(req.cookies['SAI']);
				res.status(result.status).json(result);
			break; 
			default:
				res.status(405).json({message: 'Invalid method'});
			break;
		}
	}
}