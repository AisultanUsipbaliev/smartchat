let controller = require('../controllers/notice');

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
				result = await controller.Get(req.cookies['SAI']);
				res.status(result.status).json(result);
			break;
			default:
				res.status(405).json({message: 'Invalid method'});
			break;
		}
	}	
}




