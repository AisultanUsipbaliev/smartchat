let teacherModel = require('../../apiModels/teacher'),
	studentModel = require('../../apiModels/student'),
	noticeModel = require('../../apiModels/notice'),
	quizModel = require('../../apiModels/quiz'),
	quizResultModel = require('../../apiModels/quizResult')

module.exports = async function(id, data) {
	try {
		if(!id) {
			if(config.production) throw new Error('invalid user')
			else return
		}
		if(!data.quiz_id) throw new Error('NO quiz_id')
		if(!data.student_id) throw new Error('NO student_id')

		let quiz = await quizModel.getTeacherQuiz(id.substr(1), data.quiz_id)
		if(!quiz) return

		quiz = await quizModel.getStudentQuiz(data.student_id, data.quiz_id)
		if(!quiz) return

		data.link = {
			type: 1,
			str: '/quiz?id='+quiz.id,
			id: quiz.id
		}

		data.notice = 10
		data.msg = `Преподаватель проверил ваше задание`
		data.notice_id = await noticeModel.write(data.student_id, 0, data.msg, JSON.stringify(data.link))
		
		let delivered = false
		socket.clients.forEach(ws => {
			if(ws.userid == 's' + data.student_id) {
				ws.send(JSON.stringify(data))
				delivered = true
			}
		})
	}
	catch(err) {
		await sayMe('Socket::quizChecked', {}, err.message)
	}
} 