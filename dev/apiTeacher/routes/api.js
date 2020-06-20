let profile 	= require('../controllers/profile'),
	graph 		= require('../controllers/graph'),
	schedule 	= require('../controllers/schedule'),
	template 	= require('../controllers/template'),
	chat 		= require('../controllers/chat'),
	quiz 		= require('../controllers/quiz'),
	test 		= require('../controllers/test'),
	notice 		= require('../controllers/notice'),
	balance		= require('../controllers/balance'),
	rate 		= require('../controllers/rate'),
	student 	= require('../controllers/student'),
	level 		= require('../controllers/level'),
	tResult 	= require('../controllers/result'),
	sendFile 	= require('../controllers/sendFile'),
	group 		= require('../controllers/group'),
	startLog 	= require('../log').startLog,
	endLog		= require('../log').endLog
	
module.exports = async(req, res) => {
	try {
		let result = null
		await startLog('teacher|API', req.body)
		// console.log('API: ', req.body)
		if(!req.body.method) result = {status: 405, message: 'no method'}

		if(!result) switch (req.body.method.toUpperCase()) {
			
			// Common
			case 'GET-STATUS': 						result = await notice.getStatus(req); 				break;
			case 'READ-NOTICE': 					result = await notice.readNotices(req);				break;
			case 'DELETE-NOTICE': 					result = await notice.deleteNotice(req);			break;
			case 'CLEAR-NOTICE': 					result = await notice.clearNotice(req);				break;
			case 'GET-GROUPS': 						result = await group.getGroups(req);				break;
			// Profile
			case 'GET-PROFILE': 					result = await profile.getProfile(req); 			break;
			case 'GET-NEAR-LESSONS': 				result = await schedule.getNearLessons(req);		break;
			case 'GET-BALANCE': 					result = await balance.getBalance(req);				break;
			case 'GET-BALANCE-REPORT': 	await balance.getBalanceReport(req,res); return;    			break;
			case 'UPDATE-PROFILE': 					result = await profile.updateProfile(req);			break;
			case 'UPDATE-PASSWORD': 	
				result = await profile.updatePassword(req);		
				if(result.status == 200) res.cookie('SAP', result.password, {maxAge:31104000000});
			break;
			case 'UPDATE-GRAPH': 					result = await graph.updateGraph(req); 				break;
			case 'GET-GRAPH': 						result = await graph.getGraph(req);					break;
			
			// Schedule
			case 'GET-SCHEDULE': 					result = await schedule.getSchedule(req);			break;
			
			// Template
			case 'GET-RATE': 						result = await rate.getRate(req);					break;
			case 'GET-RATES': 						result = await rate.getRates(req);					break;
			case 'GET-TEMPLATES': 					result = await template.getTemplates(req);			break;
			case 'UPDATE-TEMPLATE': 				result = await template.updateTemplate(req);		break;
			case 'ADD-TEMPLATE': 					result = await template.addTemplate(req);			break;
			case 'DELETE-TEMPLATE': 				result = await template.deleteTemplate(req);		break;
			case 'SWAP-TEMPLATES': 					result = await template.swapTemplate(req);			break;
			case 'FIND-TEMPLATES': 					result = await template.findTemplates(req); 		break;

			// Student
			case 'GET-STUDENT': 					result = await student.getStudent(req);				break;
			case 'GET-STUDENTS': 					result = await student.getStudents(req);			break;
			
			// Quiz
			case 'GET-QUIZ': 						result = await quiz.getQuiz(req);					break;
			case 'GET-QUIZ-LIST': 					result = await quiz.getQuizList(req);				break;
			case 'GET-QUIZ-RESULT': 				result = await quiz.getQuizResult(req);				break;
			case 'GET-QUIZ-RESULT-LIST': 			result = await quiz.getQuizResultList(req);			break;

			case 'GET-STUDENT-QUIZ-RESULT-LIST': 	result = await quiz.getStudentQuizResultList(req);	break;

			case 'ADD-QUIZ': 						result = await quiz.addQuiz(req);					break;
			case 'UPDATE-QUIZ': 					result = await quiz.updateQuiz(req);				break;
			case 'FIND-QUIZ': 						result = await quiz.findQuiz(req); 					break;
			case 'DELETE-QUIZ': 					result = await quiz.deleteQuiz(req); 				break;
			case 'CHECK-QUIZ': 						result = await quiz.checkQuiz(req); 				break;
			case 'SEND-QUIZ': 						result = await quiz.sendQuiz(req); 					break;
			
			// Test
			case 'GET-TEST': 						result = await test.getTest(req);					break;
			case 'GET-TEST-LIST': 					result = await test.getTestList(req);				break;
			case 'ADD-TEST': 						result = await test.addTest(req);					break;
			case 'UPDATE-TEST': 					result = await test.updateTest(req);				break;
			case 'FIND-TEST': 						result = await test.findTest(req);					break;
			case 'DELETE-TEST': 					result = await test.deleteTest(req);				break;
			case 'GET-LEVELS': 						result = await level.getLevels(req);				break;
			case 'SEND-TEST': 						result = await test.sendTest(req);					break;
			
			// Result
			case 'GET-RESULT': 						result = await tResult.getResult(req);				break;
			case 'GET-RESULT-LIST': 				result = await tResult.getResultList(req);			break;
			case 'GET-STUDENT_RESULT-LIST': 		result = await tResult.getStudentResultList(req);	break;

			// Chat
			case 'GET-CHATS': 						result = await chat.getChats(req); 					break;
			case 'SEARCH-CHAT': 					result = await chat.searchChat(req);				break;
			case 'GET-CHAT': 						result = await chat.getChat(req);					break;
			case 'SEARCH-MESSAGE': 					result = await chat.searchMessage(req);				break;
			
			// Files
			case 'SEND-FILE': 						result = await sendFile(req);						break;

			default: result = { status: 405, message: "INVALID METHOD"}; 								break;			
		}

		// console.log('API+RESULT: ', result)
		await endLog('api', result, req.body.myId)
		res.status(result.status).json(result)
	} catch (err) {	
		console.log(err)
		await endLog('teacher|API::ERROR', { err: err.message, route: 'api', data: req.body }, req.body.myId)
		res.status(404).json({err: 'Ошибка на сервере'})
	}
}