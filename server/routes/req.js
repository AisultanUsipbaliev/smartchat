let controller = require('../controllers/req');

module.exports = async function(req,res)
{
	if(!req.cookies['SAI'])
	{
		res.status(418).json({message: 'no index'});
	}		
	else
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
			//Отклоняем заявку
				case 'REJECT':
					result = await controller.Reject(req.body, req.cookies['SAI'], req.cookies['SAT']);
					res.status(result.status).json(result);
				break;
			//Создаем группу и записываем туда студента
				case 'TAKE-ON':
					result = await controller.TakeOn(req.body, req.cookies['SAI'], req.cookies['SAT']);
					res.status(result.status).json(result);
				break;
			//Записываем студента в группу
				case "TAKE-IN":
					result = await controller.TakeIn(req.body, req.cookies['SAI'], req.cookies['SAT']);
					res.status(result.status).json(result);
				break;
			//Выдает подходящие группы
				case 'GET-GROUPS':
					result = await controller.GetGroups(req.body, req.cookies['SAI']);
					res.status(result.status).json(result);
				break;
			//Выдает все заявки
				case "GET":
					result = await controller.Get(req.body, req.cookies['SAI']);
					res.status(result.status).json(result);
				break;
			//Выдает график заявки студента
				case "GET-GRAPH":
					result = await controller.GetGraph(req.body, req.cookies['SAI']);
					res.status(result.status).json(result);
				break;
			//Ошибка
				default:
					res.status(405).json({message: 'Invalid method'});
				break;
			}
		}
	}
}
