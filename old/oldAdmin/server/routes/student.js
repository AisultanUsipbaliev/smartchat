const controller = require('../controllers/student');

module.exports = async (req, res) =>
{
	try 
	{
		startLog('student', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");

		let result = null;
		switch (req.body.method.toUpperCase())
		{
			case 'UPDATE': 												result = await controller.Update(req);											break;
			case 'DELETE': 												result = await controller.Delete(req);											break;
			case 'BLOCK': 												result = await controller.Block(req);												break;
			case 'STREAM': 												result = await controller.Stream(req);											break;
			case 'GET-STUDENT-LIST': 							result = await controller.GetStudentList(req); 							break;
			case 'GET-SELECTED-GROUP':  					result = await controller.GetSelectedGroup(req);						break;
			case 'GET-SELECTED-TEACHER':  				result = await controller.GetSelectedTeacher(req);					break;
			case 'GET-SELECTED-RATE':  						result = await controller.GetSelectedRate(req);							break;
			case 'GET-STUDENT-ALL-INFO': 					result = await controller.GetStudentAllInfo(req);						break;
			case 'GET-STUDENT-BASIC-INFO':				result = await controller.GetStudentBasicInfo(req);					break;
			case 'GET-LEARNING-PROCESS': 					result = await controller.GetLearningProcess(req);					break;
			case 'GET-REG-INFO': 									result = await controller.GetRegInfo(req);									break;
			case 'GET-VISIT-HISTORY': 						result = await controller.GetVisitHistory(req);							break;
			case 'GET-SRT-LIST': 									result = await controller.GetSrtList(req);									break;
			case 'INSERT-STUDENT-SHEDULE': 				result = await controller.CreateShedule(req);								break;			
			case 'UPDATE-STUDENT-GROUP': 					result = await controller.UpdateStudentGroup(req);					break;
			case 'UPDATE-STUDENT-GROUP-TEACHER': 	result = await controller.UpdateStudentGroupTeacher(req);		break;			
			case 'UPDATE-STUDENT-GROUP-RATE': 		result = await controller.UpdateStudentGroupRate(req);			break;			
			case 'UPDATE-STUDENT-REG-TEACHER': 		result = await controller.UpdateStudentRegTeacher(req);			break;			
			case 'UPDATE-STUDENT-EMAIL-ACTIVATE': result = await controller.UpdateStudentEmailActivate(req);	break;			
			case 'UPDATE-STUDENT-PHONE-ACTIVATE': result = await controller.UpdateStudentPhoneActivate(req);	break;			
			case 'UPDATE-STUDENT-CHART': 					result = await controller.UpdateStudentChart(req);					break;
			case 'UPDATE-STUDENT-ALL-CHARTS': 		result = await controller.UpdateStudentAllCharts(req);			break;
			case 'UPDATE-STUDENT-PASSWORD': 			result = await controller.UpdateStudentPassword(req);				break;
			case 'UPDATE-STUDENT-LEVEL': 					result = await controller.UpdateStudentLevel(req);					break;
			case 'UPDATE-STUDENT-MAIL-ON': 				result = await controller.UpdateStudentMailOn(req);					break;
			case 'UPDATE-STUDENT-SMS-ON': 				result = await controller.UpdateStudentSmsOn(req);					break;
			case 'DELETE-STUDENT-CHART': 					result = await controller.DeleteStudentChart(req);					break;
			default: 															result = { status: 405, message: "INVALID METHOD"}; 				break;
		}
		endLog('student', result);
		res.status(result.status).json(result);
	}
	catch (err)
	{
		endLog('student::ERROR', err);
		res.status(404).json({err: 'Ошибка на сервере'});
	}
} 