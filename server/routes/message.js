let controller = require('../controllers/message');

module.exports = async function(req, res)
{
	console.log(req.body)
	if(req.body.notice == null)
	{
		res.status(405).json({message: 'no notice'});
	}
	else
	{
		let result;
		switch(Number(req.body.notice))
		{
			//Сокет на сообщение
			case 0: 
				result = await controller.Message(req.body); 
				res.status(result.status).json(result);
			break;
			//Сокет на новую заявку
			case 1: 
				result = await controller.NewReq(req.body);
				res.status(result.status).json(result);
			break;
			//Сокет на удаление студента из группы
			case 2: 
				result = await controller.DeletedStudent(req.body); 
				res.status(result.status).json(result);

				break;
			//Сокет на удаление заявки
			case 3: 
				result = await controller.DeletedReq(req.body); 
				res.status(result.status).json(result);
				break;
			default:
				res.status(405).json({message: 'i don\'t know this notice'});
			break;
		}
	}
}