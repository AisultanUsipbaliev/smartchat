// REQUIRES
	let faq  		= require('../controllers/faq')
	let test	 	= require('../controllers/test')
	let data  		= require('../controllers/data')
	let chat 		= require('../controllers/chat')
	let quiz 		= require('../controllers/quiz')
	let chart 		= require('../controllers/chart')
	let group  		= require('../controllers/group')
	let level		= require('../controllers/level')
	let result		= require('../controllers/result')
	let notice  	= require('../controllers/notice')
	let course  	= require('../controllers/course')
	let request	 	= require('../controllers/request')
	let student  	= require('../controllers/student')
	let feedback  	= require('../controllers/feedback')
	let sendFile 	= require('../controllers/sendFile')
	let uploadPhoto = require('../controllers/uploadPhoto')

	let startLog 	= require('../functions/log').startLog
	let endLog		= require('../functions/log').endLog
	
module.exports = async function(req, res) { 
	try { 
		await startLog('api', req.body)

		if (!req.body.method) return res.status(405).json({message: 'no method'})
		let reply = null

		switch (req.body.method.toUpperCase()) {
			// Общие
				case 'GET-STATUS': 			reply = await notice.getStatus(req); 			break;
				case 'PUSH-TOKEN': 			reply = await data.addPushToken(req);			break;
				case 'SENDFILE': 			reply = await sendFile(req);					break;
				case 'READ-NOTICE': 		reply = await notice.readNotice(req);			break;
				case 'DELETE-NOTICE': 		reply = await notice.deleteNotice(req);			break;
				case 'CLEAR-NOTICE': 		reply = await notice.clearNotice(req);			break;
				case 'FEED': 				reply = await feedback.feedback(req);			break;
				case 'GET-LEVELS': 			reply = await level.getLevels(req);				break;
			// Профиль
				case 'GET-PROFILE': 		reply = await student.getProfile(req); 			break;

			// Настройки
				case 'UPLOAD-PHOTO': 		reply = await uploadPhoto(req);					break;
				case 'UPDATE-PROFILE': 		reply = await student.updateProfile(req); 		break;
				case 'SMS-STATUS': 			reply = await student.updateSMSStatus(req); 	break;
				case 'MAIL-STATUS': 		reply = await student.updateEmailStatus(req); 	break;
				case 'NEW-PHONE': 			reply = await data.newPhone(req);				break;
				case 'REPEAT': 				reply = await data.repeatEmail(req);			break;
				case 'NEW-EMAIL': 			reply = await data.newEmail(req);				break;
				case 'NEW-PASSWORD':
					reply = await student.updatePassword(req)
					if(reply.status == 200) res.cookie('SAP', reply.pass, 2, { maxAge: 900000, httpOnly: true })
				break;
			// Тарифы
				case 'GET-COURSES': 		reply = await course.getRates(req);				break;

			// Заявки
				case 'QUICKLY-TIME': 		reply = await request.getNearTime(req); 		break;
				case 'QUICKLY': 			reply = await request.sendQuickly(req); 		break;

				case 'GET-TEACHERS': 		reply = await request.getTeachersList(req);		break;
				case 'CHECK-PAYMENT': 		reply = await request.checkInvoice(req);		break;
				
				case 'SEND-REQ': 			reply = await request.sendRequest(req);			break;
				case 'DELETE-REQ': 			reply = await request.deleteRequest(req);		break;

			// Расписание
				case 'GET-CHART': 			reply = await chart.getChart(req);				break;
			// Чат
				case 'GET-CHAT': 			reply = await chat.getChat(req);				break;
				case 'GET-GROUP': 			reply = await group.getGroup(req);				break;
				case 'SEARCH-MESSAGES': 	reply = await chat.searchMessages(req);			break;

			// Тесты
				case 'GET-TESTS': 			reply = await test.getTests(req); 				break;
				case 'GET-TEST': 			reply = await test.getTest(req);				break;
				case 'GET-RESULT': 			reply = await result.getMyResult(req); 			break;
				case 'CHECK-RESULT': 		reply = await result.checkTest(req);			break;

			// Задания
				case 'GET-QUIZ-LIST': 		reply = await quiz.getQuizList(req); 			break;
				case 'GET-QUIZ': 			reply = await quiz.getQuiz(req); 				break;
				case 'SEND-QUIZ': 			reply = await quiz.sendQuiz(req); 				break;
				case 'GET-QUIZ-RESULT': 	reply = await quiz.getQuizResult(req);			break;
			
			// Отзыв
				case 'REPORT': 				reply = await feedback.addReport(req);			break;

			// FAQ
				case 'GET-FAQ': 			reply = await faq.getFAQ(req);					break;
				case 'SET-FAQ': 			reply = await faq.setFAQ(req);					break;
			// END

			default: 		return res.status(405).json({message: 'invalid method'})
		}

		await endLog('api', reply, req.body.myId)

		res.status(reply.status).json(reply)

	}  catch (err) {

		console.log(err)
		await endLog('ERROR', { err: err.message, route: 'api', data: req.body }, req.body.myId)
		res.status(500).json({err: 'Ошибка на сервере'})
	
	}
} 