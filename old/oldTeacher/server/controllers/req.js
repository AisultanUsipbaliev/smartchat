let model = require('../models/req')

exports.get = async function(req) {
	let teacherLevel = await model.getTeacherLevel(req.cookies.SAI)
	let requests 	= await model.getRequests(req.cookies.SAI, teacherLevel)

	if(requests.length > 0 ) return { status: 200, body: requests }
	else 					return { status: 202, message: 'not found' }
}

exports.getGraph = async function(req) {
	if(!req.body.student_id) return { status: 418, message: 'no student_id' };

	let graph = await model.getGraph(req.body.student_id);

	if(graph.length > 0) return { status: 200, body: graph };
	else 				return { status: 202, message: 'empty' };
}

//не используется
exports.reject = async function(req) {
	if(!req.body.student_id) return { status: 418, message: 'no student_id' };
	let deleted = await model.deleteReq(req.body.student_id, req.cookies.SAI);
	if(deleted) return {status: 200, message: 'success'};
	else		return {status: 202, message: 'error'};
}

exports.getGroups = async function(req) {
	if(!req.body.student_id) return {status: 418, message: 'no student_id'};
		
	let level 	= (await model.getStudent(req.body.student_id)).lvl;
	let reqs 	= await model.getReqs(req.body.student_id);
	let groups 	= await model.getGroups(req.cookies.SAI, reqs[0].rate_id, level, config.students);
	if(groups.length == 0) return { status: 200, mas: [], message: 'no groups' };

	let mas = [];
	for(let i = 0; i<groups.length; i++ )
	{
		let groupReqs = await model.getGroupReqs(groups[i].group_id);
		let ok = true; // хорошая группа
		for(let j = 0; j < groupReqs.length; j++) {
			let notOk = true; // плохие заявки у обеих сторон
			for(let c = 0; c < reqs.length; c++) {
				if(	groupReqs[j].start_time 	>= reqs[c].start_time 	&& 
					groupReqs[j].finish_time	<= reqs[c].finish_time 	&& 
					groupReqs[j].nday 			== reqs[c].nday)
				notOk = false; // вот уже хорошие
			}

			if(notOk) { ok = false; break; }
		}
		if(ok) mas.push(groups[i]);
	}
	return {status: 200, mas, message: 'success'};
}

exports.addStudent = async function(req) {
	if(!req.body.group_id) 		return { status: 418, message: 'no group_id' };
	if(!req.body.student_id)	return { status: 418, message: 'no student_id' }; 

	let hasChart = await model.checkChart(req.body.group_id);
	let amount = await model.getStudentsAmount(req.body.group_id);
	
	if(!hasChart && amount >= config.min_students) {
		let reqInfo = await model.getReqs(req.body.student_id);
		let rateInfo = await model.getRate(reqInfo[0].rate_id);

		let lessons = rateInfo.lessons;
		let date = new Date();
		let count = 0;
		let enough = false;

		let groupReqs 	= await model.getGroupReqs(req.body.group_id);
		let chart 		= await model.getChart(req.cookies.SAI);

		while(!enough) {
			let ms = [] // подходящее время в этот день
			let today = date.getUTCFullYear() + Number(date.getUTCMonth() + 1) + date.getUTCDate();	

			for(let i = 0; i<groupReqs.length; i++) {
				if(date.getUTCDay() == groupReqs[i].nday) {
					let kol = 0

					//считаем накладки
					for(let d = 0; d < chart.length; d++) {
						let dayStart 	= new Date(chart[d].start)
						let dayFinish 	= new Date(chart[d].finish)
						let day = dayStart.getUTCDay()
						let overDay = dayFinish.getUTCDay()

						if(day == overDay  && day == groupReqs[i].nday && 
							cross(	groupReqs[i].start_time, 	groupReqs[i].finish_time, 
									dayStart.getUTCHours(), 	dayFinish.getUTCHours()
									))
							kol++
					}
					if(kol < config.groups) {
						ms.push(groupReqs[i].start_time)
						ms.push(groupReqs[i].finish_time)
					}
				}
			}

			for(let i = 0; i<ms.length; i=i+2) {
				let insert = await model.createChart(req.body.group_id, 
					(new Date( `${today} ${Number(ms[i]) + 6}:00`)).valueOf(), 
					(new Date( `${today} ${Number(ms[i+1]) + 6}:00`)).valueOf(), 
					count+1);
				if(insert) count ++;
				
				if(count == lessons) { enough = true; break; }
			}
			if(enough) break;
			date = new Date(date.valueOf() + 1000*60*60*24);
		}
		await model.deleteGroupReqs(req.body.group_id);

		let users = await model.getStudentsByGroup(req.body.group_id);
		for(let i = 0; i <users.length; i++) {
			await model.createNotice(users[i].student_id, 'Ваше расписание создано' , 0);
		}
	}
	let updated = await model.updateStudentGroup(req.body.student_id, req.body.group_id);
	if(!updated) return {status: 405, message: 'update group_id error'};
	await model.deleteReq(req.body.student_id, req.cookies.SAI);

	let teacherInfo = await model.getTeacher(req.cookies.SAI);
	let studentInfo = await model.getStudent(req.body.student_id);
	await writeAction(`Преподаватель ${teacherInfo.email} принял(-а) заявку студента ${studentInfo.firstname} ${studentInfo.lastname}`);
	return {status: 200, message: 'success'};
}

exports.createGroup = async function(req) {
	if(!req.body.group_name) 						return {status: 418, message: 'no group_name'};
	if(!req.body.mas) 								return {status: 418, message: 'no mas'};
	if(!req.body.group_type) 						return {status: 418, message: 'no group_type'};
	if(!req.body.student_id) 						return {status: 418, message: 'no student_id'};
	if(req.body.group_type == 1 && !req.body.day) 	return {status: 418, message: 'no day'};

	let mas 		= req.body.mas.split(',');
	let group_name 	= req.body.group_name;
	let group_type 	= req.body.group_type;
	let student_id 	= req.body.student_id;
	let firstday 	= Number(req.body.day);

	let reqInfo = await model.getReqs(req.body.student_id);
	let rateInfo = await model.getRate(reqInfo[0].rate_id);
	let lessons = rateInfo.lessons;
	let rate_id = rateInfo.rate_id;

	let checkG = await checkGraph(req.cookies.SAI, mas);
	if(!checkG.result) return checkG;
		
	if(group_type == 1) {
		let checkD = await checkFirstday(firstday, mas);
		if(!checkD.result) return checkD;
		
		let checkC = await checkChart(req.cookies.SAI, firstday, mas, lessons);
		if(!checkC.result) return checkC;
	}
	else {
		let checkN = await checkGroupName(req.cookies.SAI, group_name);
		if(!checkN.result) return checkN;
	}

	let groupId = await model.createGroup(group_name, req.cookies['SAI'], group_type, rate_id);
	if(!groupId) return {status: 404, message: 'create group error'};

	let updateGroup = await model.updateStudentGroup(student_id, groupId);
	if(!updateGroup) return {status: 405, message: 'update group_id error'};
	
	let deleteReq = await model.deleteReq(student_id, req.cookies.SAI);
	if(!deleteReq) return {status: 405, message: 'delete req error'};

	if(group_type == 1) {
		let enough = false, 
			date = new Date(firstday), 
			count = 0;

		while(!enough) {
			today = date.getUTCFullYear() + '-' + Number(date.getUTCMonth() + 1) + '-' + date.getUTCDate()
			let ms = []

			for(let i = 0; i<mas.length; i=i+3) if(date.getUTCDay() == mas[i+2]) {
				ms.push(mas[i+2])
				ms.push(mas[i])
				ms.push(mas[i+1])
			}

			for(let i = 0; i<ms.length; i=i+3)
			{
				let created = await model.createChart(groupId, 
					(new Date(`${today} ${Number(ms[i+1]) + 6}:00`)).valueOf(), 
					(new Date(`${today} ${Number(ms[i+2]) + 6}:00`)).valueOf(), 
					count+1);

				if(created) count ++;
				if(count == lessons) { enough = true; break; }
			}
			if(enough) break;
			date = new Date(date.valueOf() + 1000*60*60*24);
		}

		let delivered = false;
		await model.createNotice(student_id, 'Ваше расписание создано' , 0);
	}
	else for(let i = 0; i<mas.length; i=i+3) await model.createGroupReq(groupId, mas[i], mas[i+1], mas[i+2], req.cookies['SAI']);

	let date = new Date(firstday)

	let start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), mas[0], 0))
	let stop = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), mas[1], 0))

	let teacherInfo = await model.getTeacher(req.cookies.SAI);
	let studentInfo = await model.getStudent(req.body.student_id);
	await writeAction(`Преподаватель ${teacherInfo.email} принял(-а) заявку студента ${studentInfo.firstname} ${studentInfo.lastname} с уровнем ${studentInfo.lvl_name}. 
		Дата занятия ${start.getDate()}.${start.getMonth()+1} c ${start.getHours()}:00 до ${stop.getHours()}:00.`)
	return {status: 200, message: 'Успешно обработана заявка'}
}

//Функции
	async function checkGraph(teacher_id, mas) {
		let graph = await model.getTeacherGraph(teacher_id);

		for(let j = 0; j < mas.length; j = j+3) {
			let flag = false;
			for(let i = 0; i < graph.length; i++)
				if(graph[i].nday == mas[j+2] && mas[j] >= graph[i].start_time && mas[j+1] <= graph[i].finish_time) 
					flag = true;
				
			if(!flag) return { result: false, code: 1, day: mas[j+2], start: mas[j], finish: mas[j+1], status: 202 };
		}
		return { result: true };
	}

	async function checkFirstday(day, mas) {
		let date = new Date(day)
		let flag = false
		let start

		for(let i = 0; i < mas.length; i += 3)
			if(date.getUTCDay() == mas[i+2]) {
					flag = true;
					start = mas[i];
					break;
				}

		let now = new Date();
		let dt =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), Number(start), 0, 0);
		let result = dt - now.valueOf()

		if(Math.ceil((result/1000)/60) < 15) flag = false;
		
		if(flag) 	return { result: true }
		else 		return { 
			result: false, 
			code: 5, 
			message: 'Неправильная дата первого занятия!', 
			status: 202 
		}
	}

	async function checkChart(teacher_id, firstday, mas, lessons) {
		let count = 0
		let date = new Date(firstday)
 
		while(true) {
			console.log('Насчитано: ', count)
			let ms = []

			console.log('Проверяемая дата: ', date)

			for(let i=0; i<mas.length; i+=3) if(date.getUTCDay() == mas[i+2]) {
				ms.push(mas[i])
				ms.push(mas[i+1])
			}

			console.log('Промежутки: ', ms)

			for(let i=0; i<ms.length; i+=2) {
				console.log('Промежуток: ' + ms[i] + '-' + ms[i+1] )
				let start = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), ms[i], 0)
				let finish = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), ms[i+1], 0)

				console.log('start: ', start)
				console.log('finish', finish)

				let croses = await model.countCrosses(teacher_id, start, finish)
				
				console.log('Пересечения: ', croses)

				if(croses > config.groups) return {result: false, status: 202, code: 2, today: date}
				else count ++
			}

			if(count == lessons) return {result: true}
			date = new Date(date.valueOf() + 1000*60*60*24)
		}
	}

	async function checkGroupName(teacher_id, group_name) {
		let group = await model.getGroupWhithName(teacher_id, group_name);
		if(group) 	return {result: false, status: 202, code: 3,message: 'Не повторяйте названия групп! У вас уже такая есть!'};
		else 		return {result: true};
	}

	function cross(s1, f1, s2, f2) {
		if(s1 >= f2 || s2 >= f1 ) return false;
		else return true;
	}