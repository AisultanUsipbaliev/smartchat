let controller = require('../controllers/graph');

module.exports = async function(req,res)
{
	if(!req.body.method)
	{
		res.status(405).json({message: 'no method'});
	}
	else
	{
		let result;
		console.log(req.body);
		switch(req.body.method)
		{
			case "GET":
				result = await controller.Get(req.cookies['SAI']);
				res.status(result.status).json(result);
			break;
			case 'POST': 
				result = await controller.Post(req.body, req.cookies['SAI']);
				res.status(result.status).json(result);
			break;
			default: 
				res.status(405).json({message: 'Invalid method'});
			break;
		}
	}
}

  