let updateDealStage 	= require('../../apiFunctions/updateDealStage')

let teacherModel 		= require('../../apiModels/teacher'),
	studentModel 		= require('../../apiModels/student'),
	groupModel			= require('../../apiModels/group'),
	activityModel		= require('../../apiModels/activity'),
	configModel			= require('../../apiModels/config'),
	priceModel 			= require('../../apiModels/price'),
	balanceModel		= require('../../apiModels/balance'),
	amocrmModel			= require('../../apiModels/amocrm'),
	trialModel 			= require('../../apiModels/trial'),
	implementationModel = require('../../apiModels/implementation')

module.exports = async (userId, isteacher, groupId) => {

	try {
		if(!isteacher) isteacher = 0

		let group = await groupModel.getGroup(groupId)
		let user = isteacher? await teacherModel.getTeacher(userId) : await studentModel.getStudent(userId)
		if(!user) throw new Error('invalid user ')
		user.id = isteacher? user.teacher_id: user.student_id

		await log(`checking activity for ${isteacher? 'teacher': 'student'} #${userId}`)

		let activity = await activityModel.get(userId, isteacher, groupId)
		await log(`activity length = ${activity.length}`)
		
		for(i=0; i<activity.length; i++) { 
			if(await activityModel.delete(activity[i].id)) await log(`activity deleted`)
			else await log(`activity is not deleted`)
		}

		if(!activity.length) {
			await log(`user is active`)
				
			if(isteacher) await payForTeacher(user, group, `Вы провели занятие с ${group.group_name}`)
			else if(group.rate_id == 1) setPassed(userId)

			return `${isteacher? 'Преподаватель': 'Студент'} присутствовал в течение всего занятия.`
		}

		if(activity.length >=12) {
			if(isteacher) await giveMeYourMoney(user, group, `Вы пропустили занятие с ${group.group_name}`)
			else if(group.rate_id == 1) setWasted(userId)

			return 'Пропустил все занятие!'
		}


		let mas = []
		for(let i = 0; i < activity.length; i++) {
			start = new Date(Number(activity[i].start))
			finish = new Date(Number(activity[i].finish))

			mas.push(start.getMinutes())
			mas.push(finish.getMinutes() == 0? 60: finish.getMinutes())
		}

		mas = await concatTimes(mas)

		let total = 60 - activity.length * 5

		if(isteacher) {
			if(total < 30) 	await giveMeYourMoney(user, group, `Вы пропустили большую часть занятия с ${group.group_name}`)
			else 			await payForTeacher(user, group, `Вы провели занятие с ${group.group_name}`)
		} else {
			if(group.rate_id == 1) {
				if(total <= 20) setWasted(userId)
				else { 
					setPassed(userId)
					setScore(userId, 1)
				}
			} else {
				if (total>=30) { setScore(userId, 2) }
			}
		}

		let report = `Время на занятии ${total} минут.\nПромежутки отсутствия:`
		for(let i=0; i<mas.length; i+=2) 
			report += `${mas[i]}-${mas[i+1]} `
		return report

	} catch(ex) {
		sayMe('checkUserActivity', {userId, isteacher, groupId}, ex.message)		
	}
}



async function setScore(studentId, type) {
	let implementation = await implementationModel.get(type)
	if (!implementation) sayMe('checkUserActivity', {}, 'implementation not found')
	else {
		let setScore = await studentModel.updateScore(studentId, implementation.value)
		if (!setScore) sayMe('checkUserActivity', {}, 'Can\'t set score -> studentModel.updateScore')
	}
}

async function setPassed(studentId) {
	let deal = await amocrmModel.getStudentDeal(studentId)
	if(deal) await updateDealStage(deal.dealId,  config.amocrm.passed , config.amocrm.hasTrial)
}

async function setWasted(studentId) {
	let trials = await trialModel.getMytrials(studentId)
	let deal = await amocrmModel.getStudentDeal(studentId)

	if(deal) {		
		if(trials.length) 	await updateDealStage(deal.dealId,  config.amocrm.leaved, config.amocrm.hasTrial) 
		else 				await updateDealStage(deal.dealId,  config.amocrm.wasted, config.amocrm.hasTrial)
	}
}

async function payForTeacher(teacher, group, comment) {

	let sConf = await configModel.getConfig()
	let price = await priceModel.getPrice(teacher.teacher_id, group.rate_id)
	
	let cost = price? price.amount :
		group.rate_id != 1? sConf.defaultCost : sConf.trialDefaultCost

	await balanceModel.add(teacher.teacher_id, cost, comment)
	log(`заплатили преподу ${teacher.email} ${cost} денег`)	
}

async function giveMeYourMoney(teacher, group, comment) {

	let sConf = await configModel.getConfig()
	let price = await priceModel.getPrice(teacher.teacher_id, group.rate_id)

	let cost = price? -(price.amount * 1.5 ) :
		group.rate_id != 1?  -(sConf.defaultCost * 1.5) : -(sConf.trialDefaultCost * 1.5)

	await balanceModel.add(teacher.teacher_id, cost, comment)
	log(`отобрали у препода ${teacher.email} ${cost} денег`)
}

async function concatTimes(mas) {
	while (await haveConcationTime(mas)) {
		for(let i=0; i<mas.length; i+=2) for(let j = 1; j<mas.length; j+=2) 
			if(mas[i] == mas[j] && mas[i] != -1) {
				mas.push(mas[j-1])
				mas.push(mas[i+1])
				
				mas[i] = -1
				mas[i+1] = -1
				mas[j] = -1
				mas[j-1] = -1
			}
		let newMas = []
		for(let i=0; i<mas.length; i++) if(mas[i] != -1) newMas.push(mas[i])
		mas = newMas
	}
	return mas
}

function haveConcationTime(mas) {
	for(let i=0; i<mas.length; i+=2) 
		for(let j=1; j<mas.length; j+=2)
			if(mas[i] == mas[j]) return true
	return false
}