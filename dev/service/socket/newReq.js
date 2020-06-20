let studentModel = require('../../apiModels/student')
let noticeModel = require('../../apiModels/notice')

module.exports = async function(id, data) {
	try {
		if(!id) {
			if(config.production) throw new Error('invalid user')
			else return
		}
		if(!data.teacher_id) throw new Error('NO teacher_id')

		let student = await studentModel.getStudent(id.substr(1))
		if(!student) return

		data.link = {
			type: 1,
			str: '/students',
			id: student.student_id
		}

		data.notice = 10
		data.msg = `Студент ${student.firstname} ${student.lastname} записался на ваши занятия`
		data.notice_id = await noticeModel.write(data.teacher_id, 1, data.msg, JSON.stringify(data.link))

		let delivered = false
		socket.clients.forEach(ws => {
			if(ws.userid == 't' + data.teacher_id) {
				ws.send(JSON.stringify(data))
				delivered = true
			}
		})
		
	}
	catch(err) {
		await sayMe('Socket::newReq', {}, err.message)
	}
}