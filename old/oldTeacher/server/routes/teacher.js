let controller = require('../controllers/teacher');

module.exports = async function(req, res) {
	try {
		startLog('teacher', {body: req.body, index: req.cookies.SAI});
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case "INFO": 					result = await controller.getTeacherInfo(req);			break;
			case 'PATCH': 					result = await controller.updateTeacherInfo(req); 		break;
			case 'PATCH-PASS': 				result = await controller.updateTeacherPass(req);
				if (result.status == 200) {
					res.cookie('SAP', result.hash, 2, { maxAge: 900000, httpOnly: true });	
				}		
			break;
			default: 						result = { status: 405, message: "INVALID METHOD"}; 	break;			
		}
		endLog('teacher', result);
		res.status(result.status).json(result);
	}
	catch (err) {
		await errorLog('teacher', {body: req.body, index: req.cookies.SAI}, err)
		res.status(404).json({err: 'Ошибка на сервере'});
	}
}