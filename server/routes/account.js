let controller = require('../controllers/account');
let bcrypt = require('bcryptjs');

module.exports = async function(req,res)
{
	if(!req.body.method)
	{
		res.status(405).json({message: 'no method'});
	}
	else
	{
		let  result;
		switch(req.body.method)
		{
			//Вход
			case 'LOGIN': 
				console.log('account:::LOGIN::body:', req.body);
				result = await controller.Login(req.body);
				if(result.status == 200) 
				{ 
					let salt = await bcrypt.genSalt(10);
					let hash = await  bcrypt.hash(result.body.pass, salt);

					res.cookie('SAT', result.body.firstname, 1, {maxAge: 900000, httpOnly: true}); 
					res.cookie('SAI', result.body.id, 2, 		{maxAge: 900000, httpOnly: true});
					res.cookie('SAP', hash, 3, 					{maxAge: 900000, httpOnly: true});
				}
				res.status(result.status).json(result);
			break;
			//Регистрация
			case 'REG':
				console.log('account:::REG::body:', req.body);
				result = await controller.Registrate(req.body);
				if (result.status == 200) 
				{
					let salt = await bcrypt.genSalt(10);
					let hash = await  bcrypt.hash(result.body.pass, salt);

					res.cookie('SAT', result.body.firstname, 1, {maxAge: 900000, httpOnly: true}); 
					res.cookie('SAI', result.body.id, 2, 		{maxAge: 900000, httpOnly: true});
					res.cookie('SAP', hash, 3, 					{maxAge: 900000, httpOnly: true});
				}
				res.status(result.status).json(result);
			break;
			//Проверка при регистрации
			case 'CHECK':
				result = await controller.Check(req.body);
				res.status(result.status).json(result);
			break;
			//Ошибка
			default:
				res.status(405).json( {message:'Invalid method'}); 
			break;
		}
	}
}