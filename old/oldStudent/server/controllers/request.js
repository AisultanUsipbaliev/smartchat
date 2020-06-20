let model = require('../models/request')
let getPayment = require('../functions/checkPayment')

let amocrmModel		= require('../model/amocrm')
let updateDealStage = require('../amocrm/updateDealStage')
let amoRequest 		= require('../functions/amoPost')

exports.getTeachersList = async function (req) {
	if(!req.body.rate) 		return {status: 418, message: 'no rate'}
	if(!req.body.request) 	return {status: 418, message: 'no request'}

	let accept = await model.acceptToRequest(req.body.myId)
	if(!accept) return {status: 202, message: 'no access'}

	let request = req.body.request.split(',')

	let rate 	= await model.getRateInfo(req.body.rate)
	if (!rate) return {status: 201, message: 'invalid rate'}

	let lessonNumber = rate.lessons

	let min = 1; if (lessonNumber>1) min = lessonNumber/4

	let teachers = await model.getTeachers()
	if (!teachers.length>0) return {status: 202, message: 'no teachers'}

	let matched=[]

	for (let i=0; i<teachers.length; i++) 
		if(await teacherMatched(teachers[i], request, min)) matched.push(teachers[i])
		// if(req.body.rate == 1 && (await model.getTrial(teachers[i].teacher_id, req.body.myId))) continue
	
	
	if ( matched.length>0 ) return { status: 200, body: matched }
	else return { status: 202, message: 'no one of the teachers matched' }
}

exports.sendRequest = async function (req) {
	if (!req.body.rate) 		return {status: 418, message: 'no rate'}
	if (!req.body.teacher) 		return {status: 418, message: 'no teacher'}
	if (!req.body.request) 		return {status: 418, message: 'no request'}

	console.log(req.body)

	let accept = await model.acceptToRequest(req.body.myId)
	if(!accept) return {status: 202, message: 'no access'}

	let request = req.body.request.split(',')
	let rate 	= await model.getRateInfo(req.body.rate)
	let student = await model.getStudentInfo(req.body.myId)
	let teacher = await model.getTeacherInfo(req.body.teacher)

	if (!req.body.invoiceId && rate.rate_cost > 0) 	return {status: 418, message: 'no invoiceId'}
	
	if(student.lvl == 8) 	await model.updateStudentLevel(req.body.myId);
	if(req.body.rate == 1) {
		await model.addTrial(req.body.teacher, req.body.myId)
		let deal = await amocrmModel.getStudentDeal(student.student_id)
		if(deal) {
			let updated = await updateDealStage(deal.dealId, config.amocrm.hasTrial, config.amocrm.checkTrial)
			if(!updated) console.log('wrong stages or fucking updated_at')
		}
	}
	if(req.body.invoiceId) {

		let invoiceOk = await model.invoiceIsOk(req.body.invoiceId)
		if(!invoiceOk) return {status: 201, message: 'bad invoiceId'}
		try {
			let code = await createTransaction(req.body.myId, req.body.invoiceId)
			/* временный костылек */
			if(code != 3 && false) return {status: 201, message: 'request is not allowed'}
		} catch(ex) {
			console.log('Ошибка при создании транзакции: ',ex)
		}
	}

	for (let i=0; i<request.length; i+=3) 
		await model.createRequest(req.body.myId, request[i], request[i+1],  request[i+2], req.body.rate, req.body.teacher);
	
	writeAction(`Студент ${student.firstname} ${student.lastname} подал(-а) заявку по тарифу ${rate.rate_name} преподавателю ${teacher.email}`)

	return {status: 200, message: 'req created'}
}

exports.deleteRequest = async function(req) {
	let res = await model.deleteRequest(req.body.myId)

	if(res) {
		let student = await model.getStudentInfo(req.body.myId)
		writeAction(`Студент ${student.firstname} ${student.lastname} удалил(-а) свою заявку`)
		return {status: 200, message: 'success'}
	}
	return {status: 202, message: 'I can\'t delete'}
}

exports.sendQuickly = async function(req) {
	if(!req.body.teacher) return {status: 418, message: 'no teacher'}

	let quickTeacher = req.body.teacher

	let accept = await model.acceptToRequest(req.body.myId)
	if(!accept) return {status: 202, message: 'no access'}

	let start = (await getNearTime(quickTeacher)).valueOf()
	let finish = start + 3600000 // +1 hour

	let willbe = new Date(start)
	let today = new Date()

	if(today.getDate() != willbe.getDate()) 		return {status: 201, message: 'quick request is not allowed for today'}
	if(willbe.getHours() - today.getHours() > 1) 	return {status: 201, message: 'quick request is not allowed for today'}

	let trial = await model.checkTrial(req.body.myId)
	if(trial) return {status: 201, message: 'quick request is not allowed'}
	
	let student = await model.getStudentInfo(req.body.myId)
	let teacher = await model.getTeacherInfo(quickTeacher);

	let group = await model.createQuickGroup(quickTeacher, student.firstname + ' ' + student.lastname);
	if(!group) return {status: 202, message: 'createQuickGroup error'}

	let res = await model.createQuickLesson(group, start, finish)

	if(res) {
		let deal = await amocrmModel.getStudentDeal(student.student_id)
		if(deal) {
			let updated = await updateDealStage(deal.dealId, config.amocrm.hasTrial, config.amocrm.checkTrial)
			if(!updated) console.log('wrong stages or fucking updated_at')
		}

		let date = new Date(start)
		await model.addTrial(quickTeacher, req.body.myId)
		writeAction(`Срочная заявка от студента ${student.firstname} преподавателю ${teacher.email}. 
			Дата: ${date.getDate()}/${Number(date.getMonth())+1}/${date.getFullYear()} с ${date.getHours()}:${date.getMinutes()}`)

		await model.openQuick(req.body.myId, group)
		return {status: 200}
	}
	else return {status: 202, message: 'create error'}
}

exports.getNearTime = async function(req) {
	console.log('near')
	let teacherId = 10

	let graph = await model.getGraph(59)
	if(graph.length) {
		let randik = await random(0,10)
		teacherId = randik < 7? 59:10	
	} 
	
	let date = await getNearTime(teacherId)
	return {status: 200, date, teacherId}
}

exports.checkInvoice = async function(req) {
	if(!req.body.invoiceId) return {status: 418, message: 'no invoiceId'}
	let isOk = await model.invoiceIsOk(req.body.invoiceId)
	return { status: 200, isOk }
}

async function createTransaction(id, invoice) {
	let p = await getPayment(invoice)
	
	console.log('payment: ', p)
	
	writeAction(`Произведена оплата: ${p.amount}${p.currency}.\nОт ${p.name}.\n${p.status} : ${p.message}`)

	await model.createPayment(p.transaction, p.amount, p.currency, p.invoiceId, p.ip, p.status, p.code, p.message, p.name, id)
	return p.code
}


async function getNearTime(teacher) {
	let date = new Date();
	while(date.getMinutes() != 30 && date.getMinutes() != 0) date = new Date(date.valueOf() + 1000*60);
	while(await DateIsOk(date, teacher)) date = new Date(date.valueOf() + 1000*60*30);
	return date;
}

async function DateIsOk(date, teacher) {
	let graph = await model.getGraph(teacher)
	let smartConf = await model.getConfig()

	let start = date.valueOf()
	let finish = start + 3600000 // +1час

	let crosses = await model.countCrosses(teacher, start, finish)
	if(crosses.length > smartConf.max_groups) return true

	let graphIsOk = true
	for(let i=0; i<graph.length; i++) 
		if(date.getUTCDay() == graph[i].nday && date.getUTCHours() >= graph[i].start_time && date.getUTCHours() < graph[i].finish_time)
			graphIsOk = false
	return graphIsOk
}

async function teacherMatched(teacher, request, min) {
	let cnt = 0

	let graph = await model.getGraph(teacher.teacher_id)
	if (!graph.length) return false

	for (let j=0; j<graph.length; j++)
		for (let k=0; k<request.length; k+=3)
			if (request[k+2] == graph[j].nday) {
				if (graph[j].start_time>=request[k+1] || graph[j].finish_time<= request[k]) continue
				else cnt++
			}
	if (cnt >= min) return true
	else 			return false
}


function random(min, max) {
	var rand = min - 0.5 + Math.random() * (max - min + 1)
	rand = Math.round(rand);
	return rand;
}