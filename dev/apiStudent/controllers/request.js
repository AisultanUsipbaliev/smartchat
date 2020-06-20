let reqModel 		= require('../../apiModels/request')
let rateModel 		= require('../../apiModels/rate')
let chartModel 		= require('../../apiModels/chart')
let trialModel		= require('../../apiModels/trial')
let groupModel 		= require('../../apiModels/group')
let graphModel	 	= require('../../apiModels/graph')
let configModel		= require('../../apiModels/config')
let teacherModel 	= require('../../apiModels/teacher')
let studentModel	= require('../../apiModels/student')
let paymentModel 	= require('../../apiModels/payment')
let amocrmModel		= require('../../apiModels/amocrm')
let balanceModel 	= require('../../apiModels/balance')

let getPayment 		= require('../functions/checkPayment')
let amoRequest 		= require('../functions/amoPost')
let updateDealStage = require('../amocrm/updateDealStage')


// [{start: 1, finish: 5, nday: 5}, {start: 1, finish: 5, nday: 5}, {start: 1, finish: 5, nday: 5}]
exports.getTeachersList = async function (req) {
	if(!req.body.rate) 		return {status: 418, message: 'no rate'}
	if(!req.body.request) 	return {status: 418, message: 'no request'}

	let accept = await studentModel.acceptToRequest(req.body.myId)
	if(!accept) return {status: 202, message: 'no access'}

	let request = req.body.request.split(',')

	let rate = await rateModel.getActiveRate(req.body.rate)
	if(!rate) return {status: 201, message: 'invalid rate'}

	let lessonNumber = rate.lessons

	let min = 1 
	if(lessonNumber>1) min = lessonNumber/4

	let teachers = await teacherModel.getTeachers()
	if (!teachers.length>0) return {status: 202, message: 'no teachers'}

	let matched=[]

	for (let i=0; i<teachers.length; i++) 
		if(await teacherMatched(teachers[i].teacher_id, request, min)) matched.push(teachers[i])
	
	if (matched.length>0) return { status: 200, teachers: matched }
	else return { status: 202, message: 'no one of the teachers matched' }
}

exports.sendRequest = async function (req) {
	if (!req.body.rate) 		return {status: 418, message: 'no rate'}
	if (!req.body.teacher) 		return {status: 418, message: 'no teacher'}
	if (!req.body.request) 		return {status: 418, message: 'no request'}
	
	let accept = await studentModel.acceptToRequest(req.body.myId)
	if(!accept) return {status: 202, message: 'no access'}
	
	let request = req.body.request.split(',')
	
	let rate 	= await rateModel.getRate(req.body.rate)
	if(!rate) return {status: 418, message: 'invalid rate'}
	
	let student = await studentModel.getStudent(req.body.myId)
	
	let teacher = await teacherModel.getTeacher(req.body.teacher)
	if(!teacher) return {status: 418, message: 'invalid teacher'}
	
	if(!req.body.invoiceId && rate.rate_cost > 0) 
		return {status: 418, message: 'no invoiceId'}
	
	if(req.body.rate == 1) {
		await trialModel.addTrial(req.body.teacher, req.body.myId)
		await studentModel.updateLastTeacher(req.body.myId, req.body.teacher)
		
		let deal = await amocrmModel.getStudentDeal(student.student_id)
		
		if(deal) {
			let updated = await updateDealStage(deal.dealId, config.amocrm.hasTrial, config.amocrm.checkTrial)
			if(!updated) console.log('wrong stages or fucking updated_at')
		}
	}
	
	if(req.body.invoiceId) {
		
		let invoiceOk = await paymentModel.invoiceIsOk(req.body.invoiceId)
		
		if(!invoiceOk) return {status: 201, message: 'bad invoiceId'}
		
		try {
			
			let code = await createTransaction(req.body.myId, req.body.invoiceId)
			
			/* временный костылек */
			if(code != 3 && false) return {status: 201, message: 'request is not allowed'}
		} catch(ex) {
			sayMe('Ошибка при создании транзакции', ex)
			console.log('Ошибка при создании транзакции: ', ex)
		}
	}

	if(req.body.rate > 1) {
		
		let config = await configModel.getConfig()
		await balanceModel.add(student.lastTeacher, config.goodTrial, 'Надбавка за проданный пробный')
		
	}
	
	await createSchedule(student, request, rate, req.body.teacher)
	
	// for (let i=0; i<request.length; i+=3) 
	// 	await reqModel.addReq(req.body.myId, request[i], request[i+1],  request[i+2], req.body.rate, req.body.teacher)
	
	writeAction(`Студент ${student.firstname} ${student.lastname} подал(-а) заявку по тарифу ${rate.rate_name} преподавателю ${teacher.email}`)

	return {status: 200, message: 'req created'}
}

exports.deleteRequest = async function(req) {
	let res = await reqModel.deleteMyReqs(req.body.myId)

	if(res) {
		let student = await studentModel.getStudent(req.body.myId)
		writeAction(`Студент ${student.firstname} ${student.lastname} удалил(-а) свою заявку`)
		return {status: 200, message: 'success'}
	}
	return {status: 202, message: 'I can\'t delete'}
}

exports.sendQuickly = async function(req) {
	let sConf = await configModel.getConfig()

	let accept = await studentModel.acceptToRequest(req.body.myId)
	if(!accept) return {status: 202, message: 'no access'}

	let start = (await getNearTime()).valueOf()
	let finish = start + 3600000 // +1 hour

	let willbe = new Date(start)
	let today = new Date()

	if(today.getDate() != willbe.getDate()) 
	return {status: 201, message: 'quick request is not allowed for today'}
	
	if(willbe.getHours() - today.getHours() > 1)
	return {status: 201, message: 'quick request is not allowed for today'}

	let trials = await trialModel.getTrial(req.body.myId)
	if(trials.length > 1) return {status: 201, message: 'quick request is not allowed'}
	
	let student = await studentModel.getStudent(req.body.myId)
	let teacher = await teacherModel.getTeacher(sConf.quickTeacher)

	let group = await groupModel.addGroup(sConf.quickTeacher, student.firstname + ' ' + student.lastname, 1)
	if(!group) throw new Error('addGroup error')

	let res = await chartModel.addLesson(group, start, finish, 1)
	if(res) {
	 	let deal = await amocrmModel.getStudentDeal(student.student_id)
		
		if(deal) {
			let updated = await updateDealStage(deal.dealId, config.amocrm.hasTrial, config.amocrm.checkTrial)
			if(!updated) console.log('wrong stages or fucking updated_at')
		}

		let date = new Date(start)
		await trialModel.addTrial(sConf.quickTeacher, req.body.myId)
		await studentModel.updateLastTeacher(req.body.myId, teacher)

		writeAction(`Срочная заявка от студента ${student.firstname} преподавателю ${teacher.email}. 
			Дата: ${date.getDate()}/${Number(date.getMonth())+1}/${date.getFullYear()} с ${date.getHours()}:${date.getMinutes()}`)

		await studentModel.updateGroup(req.body.myId, group)
		await studentModel.updateStream(req.body.myId, 1)
		
		return {status: 200}
	}
	else throw new Error('addLesson error')
}

exports.getNearTime = async function(req) {
	let date 	= await getNearTime()
	let today = new Date()

	let access 	= (await trialModel.getTrial(req.body.myId)).length < 2
	let cant = (today.getDate() != date.getDate()) && (date.getHours() - today.getHours() > 1)
	
	if(cant) access = false

	return {status: 200, date, access}
}

exports.checkInvoice = async function(req) {
	if(!req.body.invoiceId) return {status: 418, message: 'no invoiceId'}
	let isOk = await paymentModel.invoiceIsOk(req.body.invoiceId)
	return { status: 200, isOk }
}

async function createTransaction(id, invoice) {
	let p = await getPayment(invoice)
		
	console.log('payment: ', p)

	writeAction(`Произведена оплата: ${p.amount}${p.currency}.\nОт ${p.name}.\n${p.status} : ${p.message}`)

	await paymentModel.addPayment(p.transaction, p.amount, p.currency, p.invoiceId, p.ip, p.status, p.code, p.message, p.name, id, (new Date()).valueOf())
	return p.code
}


async function getNearTime() {
	let date = new Date()
	while(date.getMinutes() != 30 && date.getMinutes() != 0) date = new Date(date.valueOf() + 1000*60)
	while(await DateIsBad(date)) date = new Date(date.valueOf() + 1000*60*30)
	return date
}

async function DateIsBad(date, teacher) {
	let sConf = await configModel.getConfig()
	if(!teacher) teacher = sConf.quickTeacher
	
	let graph = await graphModel.getGraph(teacher)
	if(!graph.length) throw new Error('teacher has not a graph') 

	let start = date.valueOf()
	let finish = start + 3600000 // +1час

	let crosses = await chartModel.countCrosses(teacher, start, finish)
	if(crosses.length > sConf.max_groups) return true

	let graphIsOk = true
	for(let i=0; i<graph.length; i++) 
		if(date.getUTCDay() == graph[i].nday && date.getUTCHours() >= graph[i].start_time && date.getUTCHours() < graph[i].finish_time)
			graphIsOk = false

	return graphIsOk
}

async function teacherMatched(teacher, request, min) {
	let cnt = 0

	let graph = await graphModel.getGraph(teacher)
	if (!graph.length) return false

	for (let j=0; j<graph.length; j++)
		for (let k=0; k<request.length; k+=3)
			if (request[k+2] == graph[j].nday) {
				if (graph[j].start_time>=request[k+1] || graph[j].finish_time<= request[k]) continue
				else cnt++
			}
	if(cnt >= min) return true
	else 			return false
}

async function createSchedule(student, mas, rate, teacherId) {
	// console.log('mas: ', mas)
	let groupId = await groupModel.addGroup(teacherId, student.firstname + ' ' + student.lastname, rate.rate_id)
	if(!groupId) throw new Error('addGroup error')
	
	await studentModel.updateGroup(student.student_id, groupId)
	
	//[1,2,1,	2,3,4]
	let date = new Date()
	while(date.getMinutes() != 0) date = new Date(date.valueOf() + 1000*60)
	
	let count = 0
	let s = 0
	let enough = false
	while(!enough) {
		try {
			
			let dateIsBad 		= await DateIsBad(date, teacherId)
			let dateNotInMas 	= await DateNOTInMas(mas, date)

			while(dateIsBad || dateNotInMas) {
				s++

				date = new Date(date.valueOf() + 1000*60*60)
				
				dateIsBad 		= await DateIsBad(date, teacherId)
				dateNotInMas 	= await DateNOTInMas(mas, date)			
				
				// console.log(`data: ${date.getDate()}.${date.getMonth()} ${date.getHours()}:${date.getMinutes()}`)
				// console.log('dateIsBad: ', dateIsBad)
				// console.log('dateNotInMas: ', dateNotInMas)
				if(s == 10000) return
			}
			let start = date.valueOf()
			let finish = start + 3600000

			if(await chartModel.addLesson(groupId, start, finish, count + 1)) count++
			
			if(count >= rate.lessons) break;

			date = new Date(date.valueOf() + 1000*60*30)
		} catch(ex) {
			console.log(ex)
			return false
		}
	}
	return true
}

async function DateNOTInMas(mas, date) {
	for(i=0; i<mas.length; i=i+3) 
		if(mas[i] == date.getUTCHours() && mas[i+2] == date.getUTCDay() && date.getUTCMinutes() == 0) 
			return false
	return true
}