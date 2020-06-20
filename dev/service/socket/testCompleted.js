let studentModel = require('../../apiModels/student'),
	noticeModel = require('../../apiModels/notice'),
	testModel = require('../../apiModels/test'),
	resultModel = require('../../apiModels/result')

module.exports = async function(id, data) {
	try {
		if(!id) {
			if(config.production) throw new Error('invalid user')
			else return
		}
		if(!data.test_id) throw new Error('NO test_id')

		let student = await studentModel.getStudent(id.substr(1))
		if(!student) return

		let test = await testModel.getStudentTest(student.student_id, data.test_id)
		if(!test) return

		let result = await resultModel.getStudentResult(student.student_id, data.test_id)
		if (!result) return

		data.link = {
			type: 1,
			str: '/testresult/'+result.result_id,
			id: result.result_id
		}

		data.type = 'test'

		data.notice = 10  
		data.msg = `Студент ${student.firstname} ${student.lastname} выполнил тест`
		data.notice_id = await noticeModel.write(test.teacher_id, 1, data.msg, JSON.stringify(data.link))
		
		let delivered = false
		socket.clients.forEach(ws => {
			if(ws.userid == 't' + test.teacher_id) {
				ws.send(JSON.stringify(data))
				delivered = true
			}
		})
	}
	catch(err) {
		await sayMe('Socket::testCompleted', {}, err.message)
	}
} 