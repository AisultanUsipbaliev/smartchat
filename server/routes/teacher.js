let controller = require('../controllers/teacher');

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
			case "INFO":
				result = await controller.Info(req.cookies['SAI']);
				res.status(result.status).json(result);
			break;
			case 'PATCH':
				result = await controller.Patch(req.body, req.cookies['SAI']);
				res.status(result.status).json(result);
			break;
			case 'PATCH-PASS':
				result = await controller.PatchPass(req.body, req.cookies['SAI']);
				res.status(result.status).json(result);
			break;
			default:
				res.status(405).json({message: 'Invalid method'});
			break;
		}
	}
}
 