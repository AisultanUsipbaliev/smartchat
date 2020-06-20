const chartModel = require('../../apiModels/chart'),
	  studentModel = require('../../apiModels/student'),
	  teacherModel = require('../../apiModels/teacher'),
	  rateModel	= require('../../apiModels/rate'),
	  graphModel	= require('../../apiModels/graph'),
	  groupModel	= require('../../apiModels/group'),
	  configModel	= require('../../apiModels/config');

const sendingAMessageOnAllServices = require('../../apiFunctions/sendingAMessageOnAllServices'),
	  computedUtsTime 			   = require('../../apiFunctions/computedUtsTime'),
	  getUtsDateString			   = require('../../apiFunctions/getUtsDateString'),
	  dateFormat			   	   = require('../../apiFunctions/dateFormat');

exports.createOrUpdateChart = async (req) => {
	if (!req.body.data) 	{ return { status: 400, message: 'no data' }; }
	if (!req.body.group_id)	{ return { status: 400, message: 'no group_id' }; }

	let data = null;

	console.log(req.body.data)

	try {
		data = JSON.parse(req.body.data)
	} catch(e) {
		return { status: 418, message: 'invalid data' }
	}

	let updated = false;
	let deleted = false;
	let created = false;

	let studentList = await studentModel.getStudentsByChartId(data[0].chart_id);

	for (let i = 0; i < data.length; i++) {
		if (data[i].deleted) {
			let d = await chartModel.delete(data[i].chart_id);
			if (d) { deleted = true }
		} else {
			if (data[i].chart_id) {
				let u = await chartModel.update(data[i].chart_id,data[i].start,data[i].finish,data[i].lesson);
				if (u) { updated = true } 
			} else {
				let c = await chartModel.addLesson(req.body.group_id,data[i].start,data[i].finish,data[i].lesson);
				if (c) { created = true } 			
			}
		}
	}

	if (updated || created) {
		for (let i = 0; i < studentList.length; i++) {
			let studentInfo = await studentModel.getProfile(studentList[i].student_id);
			let chartInfo = await studentModel.getChartInfo(studentList[i].student_id);
			let utsDateSecond = await computedUtsTime(studentInfo.timeDifference, chartInfo.start);
			let dt = await getUtsDateString(utsDateSecond);
			let message = `Ваше расписание изменено. Дата следующего занятия ${dt}.`;
			await sendingAMessageOnAllServices(studentInfo, message);
		}
		return { status: 200 }
	} else {
		if(deleted) {
			return { status: 200 }
		} else { return { status: 204 } }
	}
}

exports.deleteChart = async (req) => {
	if(!req.body.chart_id) { return { status: 400 }; };

	let result = await chartModel.delete(req.body.chart_id);

	return result ? { status: 200 } : { status: 204 };
}

exports.suitableTeachers = async (req) => {
	if(!req.body.rate) 		return {status: 418, message: 'no rate'}
	if(!req.body.mas) 		return {status: 418, message: 'no mas'}
	if(!req.body.student) 		return {status: 418, message: 'no student'}

	let accept = await studentModel.acceptToRequest(req.body.student)
	if(accept) return {status: 400, message: 'no access'}

	let mas
	
	try {
		mas = JSON.parse(req.body.mas)
	} catch(e) {
		return { status: 418, message: 'invalid mas' }
	}

	if (!mas.length) { return { status: 418, message: 'mas length 0' } }

	console.log('mas-------------------', mas)

	let rate = await rateModel.getRate(req.body.rate)

	if(!rate) return {status: 201, message: 'invalid rate'}

	let min = rate.lessons>1 ? rate.lessons/4 : 1 
	
	let teachers = await teacherModel.getTeachers()

	console.log('teachers', teachers)

	if(!teachers.length) return {status: 202, message: 'no teachers'}

	let matched=[]

	for (let i=0; i<teachers.length; i++) {

		if(await teacherMatched(teachers[i].teacher_id, mas, min)) matched.push(teachers[i])
	}
	
	if (matched.length) return { status: 200, teachers: matched }
	else return { status: 202, message: 'no one of the teachers matched' }
}

exports.newChart = async (req) => {
	if(!req.body.student_id) 	return {status: 400, message: 'no student_id'}
	if(!req.body.mas)			return {status: 400, message: 'no mas'}
	if(!req.body.rate_id)		return {status: 400, message: 'no rate_id'}
	if(!req.body.teacher_id)	return {status: 400, message: 'no teacher_id'}


	let student = await studentModel.getStudent(req.body.student_id)
	let rate = await rateModel.getRate(req.body.rate_id)

	let mas = JSON.parse(req.body.mas)

	return await createSchedule(student, mas, rate, req.body.teacher_id)? {status: 200} : {status: 202}
}

// async function createSchedule(student, mas, rate, teacherId) { 

// 	let groupId = await groupModel.addGroup(teacherId, student.firstname + ' ' + student.lastname, rate.rate_id)
// 	if(!groupId) throw new Error('addGroup error')

// 	await studentModel.updateGroup(student.student_id, groupId)
	
// 	console.log('mas:', mas)

// 	//[1,2,1,	2,3,4]
// 	let date = new Date()
// 	while(date.getMinutes() != 30 && date.getMinutes() != 0) date = new Date(date.valueOf() + 1000*60)

// 	let count = 0
// 	let enough = false

// 	while(!enough) {
// 		try {
// 			while(await DateIsBad(date, teacherId) || await DateNOTInMas(mas, date)) date = new Date(date.valueOf() + 1000*60*30)

// 			let start = date.valueOf()
// 			let finish = start + 3600000

// 			console.log('data zanyatii: ',  await dateFormat('dd/mm/ HH:MM', date))

// 			if(await chartModel.addLesson(groupId, start, finish, count + 1)) count++

// 			if(count >= rate.lessons) break;

// 			date = new Date(date.valueOf() + 1000*60*30)
// 		} catch(ex) {
// 			console.log(ex)
// 			return false
// 		}
// 	}
// 	return true
// }

// async function DateIsBad(date, teacher) {
//   	let sConf = await configModel.getConfig()
//   	if(!teacher) teacher = sConf.quickTeacher
  
//   	let graph = await graphModel.getGraph(teacher)
// 	if(!graph.length) throw new Error('no graph')
	 
//   	let start = date.valueOf()
//   	let finish = start + 3600000 // +1час

//   	let crosses = await chartModel.countCrosses(teacher, start, finish)
//   	if(crosses.length > sConf.max_groups) return true

//   	let graphIsOk = true
//   	for(let i=0; i<graph.length; i++) 
//     	if(date.getUTCDay() == graph[i].nday && date.getUTCHours() >= graph[i].start_time && date.getUTCHours() < graph[i].finish_time)
//       		graphIsOk = false

//   	return graphIsOk
// }

// async function DateNOTInMas(mas, date) {
//   	for(i=0; i<mas.length; i=i+3) 
//     	if(mas[i] == date.getUTCHours()+1 && mas[i+2] == date.getUTCDay() && date.getUTCMinutes() == 0){  
// 			console.log('vosheel: ',  await dateFormat('dd/mm/ HH:MM', date))
//       		return false
//       	}
//   	return true
// }

// async function teacherMatched(teacher, request, min) {
// 	let cnt = 0

// 	let graph = await graphModel.getGraph(teacher)

// 	if (!graph.length) return false

// 	for (let j=0; j<graph.length; j++)
// 		for (let k=0; k<request.length; k+=3)
// 			if (request[k+2] == graph[j].nday) {
// 				if (graph[j].start_time>=request[k+1] || graph[j].finish_time<= request[k]) continue
// 				else cnt++
// 			}
// 	if(cnt >= min) return true
// 	else 		   return false
// }



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
				if(s == 10000) { 
					// console.log('после 10000 итераций завершил работу')
					return
				}
			}
			let start = date.valueOf()
			let finish = start + 3600000

			if(await chartModel.addLesson(groupId, start, finish, count + 1)) count++
			// console.log('count: ', count)
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
	for(i=0; i<mas.length; i=i+3) {
		console.log('')
		
		console.log('DATE: ', date)
		console.log('mas[i]: ', mas[i])
		console.log('date.getUTCHours(): ', date.getUTCHours())

		console.log('mas[i+2]: ', mas[i+2])
		console.log('date.getUTCDay(): ', date.getUTCDay())

		console.log('')

		if(mas[i] == date.getUTCHours() && mas[i+2] == date.getUTCDay()) 
			return false
	}
	return true
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
