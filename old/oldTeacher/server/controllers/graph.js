let model = require('../models/graph');

exports.getGraph = async function (req) {	
	let graph = await model.getGraph(req.cookies.SAI)
	if(graph.length > 0) 	return {status: 200, body: graph}
	else					return {status: 202, message: 'not found'}
}

exports.createGraph = async function (req) {
	if (!req.body.mas) 	return {status: 418, message: 'no mas'}
	let mas = req.body.mas.split(',');

	// let check = await checkChart(req.cookies.SAI, mas)
	// if(check.status != 200) return check

	await model.deleteGraph(req.cookies['SAI'])

	for(let i = 0; i< mas.length; i = i + 3) {
		let inserted = await model.createGraph(req.cookies['SAI'], mas[i], mas[i+1], mas[i+2])
		if (!inserted) return {status: 202, message: 'create error'}
	}
	
	let teacher = await model.getTeacher(req.cookies.SAI)
	await writeAction(`Преподаватель ${teacher.email} изменил(-а) график работы.`)
	return {status: 200, message: 'ok'}
}

async function checkChart(myId, mas) {
	let chart = await model.getChart(myId)
	for(let i = 0; i < chart.length; i++) {
		
		let start = new Date(chart[i].start)
		let finish = new Date(chart[i].finish)

		let startOk = false
		let finishOk = false
		for(let j = 0; j< mas.length; j = j +3) {

			if(start.getDay() == finish.getDay()) {
				if(start.getDay() == mas[j+2] && start.getUTCHours() >= mas[j] && start.getUTCHours() <= mas[j])
					if(finish.getDay() == mas[j+2] && finish.getUTCHours() >= mas[j] && finish.getUTCHours() <= mas[j]) {
						finishOk = true
						startOk = true
					}
			}
			else {
				if(start.getDay() == mas[j+2] && start.getUTCHours() >= mas[j] && start.getUTCHours() <= mas[j]) startOk = true
				if(finish.getDay() == mas[j+2] && finish.getUTCHours() >= mas[j] && finish.getUTCHours() <= mas[j]) finishOk = true	
			}
		}

		if(!startOk || !finishOk) return { status: 201, start: start.valueOf(), finish: finish.valueOf()}
	}
	return{ status: 200 }
}