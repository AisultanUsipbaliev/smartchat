let studentModel	= require('../../apiModels/student'),
	teacherModel	= require('../../apiModels/teacher'),
	groupModel		= require('../../apiModels/group'),
	lateModel		= require('../../apiModels/late'),
	trialReportModel= require('../../apiModels/trialReport'),
	configModel		= require('../../apiModels/config'),
	noticeModel		= require('../../apiModels/notice'),
	priceModel		= require('../../apiModels/price'),
	balanceModel	= require('../../apiModels/balance')

let checkUserActivity = require('./checkUserActivity')

module.exports = async (user, isteacher, group) => {
	
	let groupId = group.group_id
	let userId = isteacher? user.teacher_id : user.student_id

	await log('checkUserLate started')
	let date = new Date()
	let rate = await groupModel.getRate(groupId)
	let sConf = await configModel.getConfig()
	let price = await priceModel.getPrice(userId, group.rate_id)

	let cost = price? -(price.amount * 1.5 ) :
			group.rate_id != 1?  -(sConf.defaultCost * 1.5) : -(sConf.trialDefaultCost * 1.5)

	user.firstname = isteacher? user.login : user.firstname

	await log(`checking late for ${isteacher? 'teacher': 'student'} ${user.firstname} ${user.lastname}`)

	let lates = await lateModel.getLates(userId, isteacher)

	if(lates.length) {
		if(!(await lateModel.deleteLates(userId, isteacher))) await log('lates is not deleted', {userId, isteacher}, 1)

		log('this user is late')
		let notice = isteacher? 'Вы пропустили занятие с ' + group.group_name : 'Вы пропустили занятие!'
		await noticeModel.add(userId, isteacher, notice)

		if(isteacher) {
			await balanceModel.add(userId, cost, notice)
			log(`отобрали у препода ${user.email} ${cost} денег`)
		}
	}

	let report = await checkUserActivity(userId, isteacher, groupId)
	await writeAction(`${isteacher? 'Преподаватель' : 'Студент'} ${user.firstname} ${user.lastname} закончил занятие по тарифу ${rate.rate_name}!\n ${report}`)

	if(!isteacher) trialReportModel.add(userId, `${user.firstname} ${user.lastname} (${user.phone})\nЗанятие с ${Number(date.getHours())-1}:${date.getMinutes()} до ${date.getHours()}:${date.getMinutes()}\n${report}`)

	await log('checkUserLate completed')
}