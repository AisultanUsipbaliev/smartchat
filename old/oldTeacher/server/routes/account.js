let controller = require('../controllers/account')
module.exports = async function(req, res) {
	try {

		startLog('account', {body: req.body, index: req.cookies.SAI}, 1);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result
		switch (req.body.method.toUpperCase()) {
			case "LOGIN": 
				result = await controller.loginTeacher(req);
				if (result.status==200 || result.status === 201) {
					res.cookie('SAT', req.body.email.toLowerCase(), 1, 			{ maxAge: 900000, httpOnly: true });
					res.cookie('SAP', result.pass, 2, 							{ maxAge: 900000, httpOnly: true });
					res.cookie('SAI', result.teacher_id, 3, 					{ maxAge: 900000, httpOnly: true });
					res.cookie('SAN', result.login + ' ' + result.lastname, 4, 	{ maxAge: 900000, httpOnly: true });
				}
			break;
			case 'REG':
				result = await controller.addTeacher(req); 
				if (result.status==200) {
					res.cookie('SAT', req.body.email.toLowerCase(), 1, 			{ maxAge: 900000, httpOnly: true });
					res.cookie('SAP', result.pass, 2, 							{ maxAge: 900000, httpOnly: true });
					res.cookie('SAI', result.teacher_id, 3, 					{ maxAge: 900000, httpOnly: true });
					res.cookie('SAN', result.login + ' ' + result.lastname, 4, 	{ maxAge: 900000, httpOnly: true });
				}				
			break;
			case 'CHECK': 	result = await controller.checkTeacher(req); 			break;
			case 'REPEAT': 	result = await controller.repeatEmail(req);				break;
			default: 		result = { status: 405, message: "INVALID METHOD"}; 	break;			
		}
		endLog('account', result, 1)
		res.status(result.status).json(result)
	}
	catch (err) {
		console.log(err)
		await errorLog('account', {body: req.body, index: req.cookies.SAI}, err)
		res.status(404).json({err: 'Ошибка на сервере'})
	}
}
 