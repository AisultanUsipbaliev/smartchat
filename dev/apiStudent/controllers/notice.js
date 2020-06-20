let nfModel 		= require('../../apiModels/needFeedback')
let quizResultModel = require('../../apiModels/quizResult')
let studentModel 	= require('../../apiModels/student')
let noticeModel 	= require('../../apiModels/notice')
let testModel 		= require('../../apiModels/test')
let chatModel 		= require('../../apiModels/chat')
let lateModel 		= require('../../apiModels/late')
let groupModel 		= require('../../apiModels/group')
let teacherModel 	= require('../../apiModels/teacher')
let unreadModel 	= require('../../apiModels/unread')

exports.deleteNotice = async (req) => {
	if(!req.body.notice_id) return { status: 418, message: 'no notice_id' }
	await noticeModel.delete(req.body.myId, req.body.notice_id, 0)
	return {status: 200}
}

exports.clearNotice = async (req) => {
	let notices = await noticeModel.getStudentNotices(req.body.myId)

	for (var i = 0; i < notices.length; i++) {
		await noticeModel.delete(req.body.myId, notices[i].notice_id, 0)
	}
	return {status: 200}
}

exports.readNotice = async function(req) {
	let res = await noticeModel.readStudentNotices(req.body.myId)
	return res? {status:200} : {status: 202}
}

exports.getStatus = async function(req) {
	let notices 			= await noticeModel.getStudentNotices(req.body.myId)
	let unfullfilledQuiz 	= await quizResultModel.getStudentQuizResultCount(req.body.myId)
	let unfullfilledTests 	= await testModel.getMyTestsCount(req.body.myId)
	let unreadMessage 		= await unreadModel.getCount(req.body.myId)
	let needFeedback 		= await nfModel.get(req.body.myId)

	await checkLate(req.body.myId)
	return {status:  200, notices, unfullfilledQuiz, unfullfilledTests, needFeedback, unreadMessage}
}

//Опоздашки 
async function checkLate(myId) {
	let now = (new Date()).valueOf()
	let lates = await lateModel.getStudentLates(myId)

	let student = await studentModel.getStudent(myId)
		
	for(let i = 0; i < lates.length; i++) {
		let rate 	= await groupModel.getRate(lates[i].group_id)
		if(!rate) break
	
		let started = (new Date(Number(lates[i].dt))).valueOf()
		let minutes = Math.round((now - started) / 60000)
		
		if(minutes > 5)
			await writeAction(`Студент ${student.firstname} ${student.lastname} опоздал(-а) на занятие 
				по тарифу ${rate.rate_name} на ${minutes} мин.`)
	}

	await lateModel.deleteStudentLates(myId)
}