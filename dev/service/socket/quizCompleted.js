let studentModel = require('../../apiModels/student'),
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

		let student = await studentModel.getStudent(id.substr(1))
		if(!student) return

		let quiz = await quizModel.getStudentQuiz(student.student_id, data.quiz_id)
		if(!quiz) return

		let quizResult = await quizResultModel.getStudentResultByQuizId(student.student_id, data.quiz_id)
		if (!quizResult) return

		data.link = {
			type: 1,
			str: '/homeresult/'+quizResult.id,
			id: quizResult.id
		}

		data.type = 'quiz'

		data.notice = 10
		data.msg = `Студент ${student.firstname} ${student.lastname} выполнил задание`
		data.notice_id = await noticeModel.write(quiz.teacher, 1, data.msg, JSON.stringify(data.link))
		
		let delivered = false
		socket.clients.forEach(ws => {
			if(ws.userid == 't' + quiz.teacher) {
				ws.send(JSON.stringify(data))
				delivered = true
			}
		})
	}
	catch(err) {
		await sayMe('Socket::quizCompleted', {}, err.message)
	}
} 