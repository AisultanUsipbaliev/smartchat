let controller = require('../controllers/group');

module.exports = async function(req,res)
{
	if(!req.body.method)
	{
		res.status(405).json({message: 'no method'});
	}
	else
	{
		if(!req.cookies['SAI'])
		{
			res.status(418).json({message: 'no index'});
		}
		else
		{
			let result;
			switch(req.body.method)
			{
				case "GET":
					result = await controller.Get(req.body, req.cookies['SAI']);
					res.status(result.status).json(result);
				break;
				case "POST":
					result = await controller.Post(req.body);
					res.status(result.status).json(result);
				break;
				case "DELETE":
					result = await controller.Delete(req.body);
					res.status(result.status).json(result);
				break;
				default:
					res.status(405).json({message: 'Invalid method'});
				break;
			}
		}
	}
}


