let noticeModel 	= require('../../apiModels/notice'),
	teacherModel 	= require('../../apiModels/teacher'),
	lateModel  		= require('../../apiModels/late'),
	balanceModel	= require('../../apiModels/balance'),
	groupModel 		= require('../../apiModels/group'),
	chatModel		= require('../../apiModels/chat'),
	quizModel		= require('../../apiModels/quiz'),
	studentModel	= require('../../apiModels/student'),
	resultModel		= require('../../apiModels/result'),
	graphModel 		= require('../../apiModels/graph')

exports.getStatus = async (req) => { 
	if (req.body.unverifiedQuizResult) return { status: 200, unverifiedQuizResult: await quizModel.getTeacherUnverifiedQuizResultCount(req.body.myId) }
	if (req.body.unreadTestResult) return { status: 200, unreadTestResult: await resultModel.getUnreadResultCount(req.body.myId) }
	if (req.body.graphLength) return { status: 200, graphLength: (await graphModel.getGraph(req.body.myId)).length }
	if (req.body.notices) return { status: 200, notices: await noticeModel.getTeacherNotices(req.body.myId) }

	let groups = await groupModel.getTeacherGroups(req.body.myId)

	let unreadMessage = 0
	
	for (let i = 0; i < groups.length; i++) {
		let countMessage = await chatModel.getTeacherUnreadMesCount(groups[i].group_id) 
		unreadMessage+=countMessage
	}
	
	if (req.body.unreadMessage) return { status: 200, unreadMessage }

	let unverifiedQuizResult = await quizModel.getTeacherUnverifiedQuizResultCount(req.body.myId)
	let unreadTestResult = await resultModel.getUnreadResultCount(req.body.myId)
	let graphLength = (await graphModel.getGraph(req.body.myId)).length
	let notices = await noticeModel.getTeacherNotices(req.body.myId)

	await checkTeacherLate(req.body.myId)

	return { status: 200, notices, unreadMessage, unverifiedQuizResult, unreadTestResult, graphLength }
}

exports.readNotices = async (req) => {
	await noticeModel.readTeacherNotices(req.body.myId)
	return {status: 200}
}

exports.deleteNotice = async (req) => {
	if(!req.body.notice_id) return { status: 418, message: 'no notice_id' }
	await noticeModel.delete(req.body.myId, req.body.notice_id, 1)
	return {status: 200}
}

exports.clearNotice = async (req) => {
	let notices = await noticeModel.getTeacherNotices(req.body.myId)

	for (var i = 0; i < notices.length; i++) {
		await noticeModel.delete(req.body.myId, notices[i].notice_id, 1)
	}
	return {status: 200}
}

async function checkTeacherLate(teacherId) {

	let now = (new Date()).valueOf()
	let lates = await lateModel.getTeacherLates(teacherId)
	await lateModel.deleteTeacherLates(teacherId)

	let teacher = await teacherModel.getTeacher(teacherId)
		
	for(i=0; i<lates.length; i++) {

		console.log('lates', lates)
		
		let group = await groupModel.getGroup(lates[i].group_id)
		let started = (new Date(Number(lates[i].dt))).valueOf()
		let minutes = Math.round((now - started) / 60000)
		
		if(minutes > 5) {
			await writeAction(`Преподаватель ${teacher.login} ${teacher.lastname} опоздал(-а) на занятие c ${group.group_name} на ${minutes} мин.`)
			balanceModel.add(teacherId, -100, `Вы опоздали на занятие с ${group.group_name}`)
		}
	}
}