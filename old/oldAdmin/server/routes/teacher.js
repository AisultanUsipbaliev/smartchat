const controller = require('../controllers/teacher');

module.exports = async (req, res) =>
{
	try 
	{
		startLog('teacher', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");

		let result = null;
		switch (req.body.method.toUpperCase())
		{
			case 'GET-TEACHER-LIST': 							result = await controller.GetTeacherList(req); 							break;
			case 'DELETE': 												result = await controller.Delete(req);											break;
			case 'BLOCK': 												result = await controller.Block(req);												break;
			case 'UPDATE-TEACHER-PHONE-ACTIVATE': result = await controller.UpdateTeacherPhoneActivate(req);	break;
			case 'UPDATE-TEACHER-EMAIL-ACTIVATE': result = await controller.UpdateTeacherEmailActivate(req);	break;
			case 'UPDATE-TEACHER-LEVEL': 					result = await controller.UpdateTeacherLevel(req);					break;
			case 'UPDATE-TEACHER-SMS-ON': 				result = await controller.UpdateTeacherSmsOn(req);					break;
			case 'UPDATE-TEACHER-PASSWORD': 			result = await controller.UpdateTeacherPassword(req);				break;
			case 'UPDATE-TEACHER-MAIL-ON': 				result = await controller.UpdateTeacherMailOn(req);					break;
			case 'UPDATE-TEACHER-SHEDULE': 				result = await controller.UpdateTeacherShedule(req);				break;
			case 'EDIT-ROLE': 										result = await controller.EditRole(req);										break;
			case 'GET-TEACHER-ALL-INFO': 					result = await controller.GetTeacherAllInfo(req); 					break;
			case 'GET-TEACHER-GROUP-LIST': 				result = await controller.GetTeacherGroupList(req); 				break;
			default: 															result = { status: 405, message: "INVALID METHOD"}; 				break;
		}
		endLog('teacher', result);
		res.status(result.status).json(result);
	}
	catch (err)
	{
		endLog('teacher::ERROR', err);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
}  