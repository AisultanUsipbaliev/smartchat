let model = require('../models/schedule');
 
exports.getChart = async function (req)
{	
	if (!req.body.begin || !req.body.end) {
		let chart 	= await model.getChartByTeacherId(req.cookies['SAI'])

		if(chart.length > 0) 					return {status: 200, message: 'success', body: chart}
		else 									return {status: 202, message: 'Нет занятий!'}
	} else {
		let begin 	= new Date(Number(req.body.begin)).valueOf();
		let end 	= new Date(Number(req.body.end)).valueOf();

		let chart 	= await model.getChartByTeacherIdAndDay(req.cookies['SAI'], begin, end);
		
		if(chart.length > 0) 					return {status: 200, message: 'success', body: chart};
		else 									return {status: 202, message: 'Нет занятий!'};
	}
}

exports.getFullChart = async function (req) {
	if (!req.body.firstday) return {status: 418, message: 'no firstday'}
	if (!req.body.lastday) 	return {status: 418, message: 'no lastday'}
	//Красные дни
	let redDays = []

	let curdate = new Date(req.body.firstday)
	let lastday = new Date(req.body.lastday)

	let chart = await model.getChartByTeacherId(req.cookies['SAI'])

	if (chart.length == 0) return {status: 200, mas: []}

	let graph = await model.getGraphByTeacherId(req.cookies['SAI']);

	if (graph.length == 0) return {status: 200, mas: []};

	for(;;) {
		// Все занятия в этот день
		let lessons = [];

		for(let i=0; i<chart.length; i++) {
			let start = new Date(chart[i].start);
			let finish = new Date(chart[i].finish)

			if(await compareDates(start, curdate) || await compareDates(finish, curdate))  lessons.push(chart[i])
		}

		if(lessons.length > 0)
		{
			// Время работы в этот день
			let start 	= 0;
			let finish 	= 0;

			for(let i = 0; i<graph.length; i++) {
				if(graph[i].nday == curdate.getUTCDay()){
					start 	= graph[i].start_time;
					finish 	= graph[i].finish_time;
				}
			}

			let isred = true;

			if(start == 0 && finish == 0) isred = false;

			//Осталось проверить красный этот день или нет
			for(let i = start; i<finish; i++) {
				let count = 0;

				for(let j=0; j<lessons.length; j++) {
					let lessonStart = (new Date(lessons[j].start)).getUTCHours()
					let lessonFinish = (new Date(lessons[j].finish)).getUTCHours()

					if(i >= lessonStart && i+1 <= lessonFinish)	count++;
				}

				if(count < config.groups) {
					isred = false;
					break;
				}
			}

			if(isred) redDays.push(curdate);
		}

		curdate = new Date(curdate.valueOf() + 1000*60*60*24);

		if( await compareDates(curdate, lastday)) break;
	}
	
	return {status: 200, mas: redDays};
}

function compareDates(date1, date2) {
	if( date1.getUTCDate() == date2.getUTCDate() 
		&& date1.getUTCMonth() == date2.getUTCMonth() 
		&& date1.getUTCFullYear() == date2.getUTCFullYear())
		return true;
	else return false;
}	