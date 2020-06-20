let reportModel		= require('../../apiModels/report')
let studentModel 	= require('../../apiModels/student')
let ratingModel		= require('../../apiModels/rating')
let teacherModel	= require('../../apiModels/teacher')
let feedbackModel	= require('../../apiModels/feedback')
let nfModel 		= require('../../apiModels/needFeedback')

exports.feedback = async function(req) {
	if(!req.body.value) return {status: 418, message: 'no value'}
	if(!req.body.teacher_id) req.body.teacher_id = 0
	let comment = req.body.comment || ''
		
	let need = await nfModel.get(req.body.myId, req.body.teacher_id)
	if(!need.length) return {status: 403, message: 'Ваша оценка не нужна'}

	let student = await studentModel.getStudent(req.body.myId)
	let teacher = req.body.teacher_id? await teacherModel.getTeacher(req.body.teacher_id) : null

	let add = null
	if(teacher) {
		writeAction(`Отзыв о преподавателе ${teacher.email} от студента ${student.firstname}:\nОценка: ${req.body.value}!\nКомментарий: ${comment}`)
		add = await ratingModel.addRating(req.body.myId, req.body.teacher_id, req.body.value, comment)
	} else {
		writeAction(`Отзыв о Smartchat от студента ${student.firstname}:\nОценка: ${req.body.value}!\nКомментарий: ${comment}`)
		add = await feedbackModel.addFeedback(req.body.myId, comment, req.body.value)
	}

	if(add) {
		let deleted = await nfModel.delete(req.body.myId, req.body.teacher_id)
		if(!deleted) throw new Error('Can\'t delete feed -> nfModel.deleteSmart')
		return {status: 200}
	} else throw new Error('Can\'t feed ' + req.body.teacher_id)
}

exports.addReport = async function(req) {
	if(!req.body.comment) 		return {status: 418, message: 'no comment'}

	let student = await studentModel.getStudent(req.body.myId)
	writeAction(`Обратная связь от студента ${student.firstname}: ${req.body.comment}. ${req.body.file? ' web.smartchat.kz/common/files/' + req.body.file:''}`)

	let add = await reportModel.addReport(req.body.myId, req.body.comment, req.body.file)
	if(add) return {status: 200}
	else throw new Error(`Can\'t add report -> reportModel.addReport`)
}