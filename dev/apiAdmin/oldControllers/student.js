const computedUtsTime 							= require('../../apiFunctions/computedUtsTime');
const getUtsDateString							= require('../../apiFunctions/getUtsDateString');
const sendingAMessageOnAllServices	= require('../../apiFunctions/sendingAMessageOnAllServices');
const generateId										= require('../../apiFunctions/generateId');
const bcrypt 												= require('bcryptjs');

const model 												= require('../models/student');

const groupModel 		= require('../model/group'),
			studentModel 	= require('../model/student'),
			chartModel 		= require('../model/chart'),
			configModel 	= require('../model/config'),
			graphModel		= require('../model/graph'),
			rateModel     = require('../model/rate'),
			teacherModel 	= require('../model/teacher')

exports.GetStudentList = async (req) =>
{
	if (typeof(req.body.column) == undefined && req.body.column === null) 		{ return { status: 400, message: 'no column' }; }
	if (typeof(req.body.order) == undefined && req.body.order === null) 		  { return { status: 400, message: 'no order'  }; }
	if (typeof(req.body.from) == undefined && req.body.from === null) 			  { return { status: 400, message: 'no from'   }; }
	if (typeof(req.body.limit) == undefined && req.body.limit === null) 		  { return { status: 400, message: 'no limit'  }; }

	let students = null;

	let column = parseInt(req.body.column);
	let from 	 = parseInt(req.body.from);
	let limit	 = parseInt(req.body.limit);

	let order = '';
	if (req.body.order == 'true') { order = 'desc'; } else if (req.body.order == 'false') { order = 'asc'; }

	let text 	 = '';
	if (typeof(req.body.text) != undefined && req.body.text !== null) { text = req.body.text.trim(); }

	let filter = null;
	if (parseInt(req.body.filter) === 0 || parseInt(req.body.filter) === 1) { 
		students = await model.getFilteredStudentList(parseInt(req.body.filter), column, order, from, limit, text); 
	}	else { 
		students = await model.getStudentList(column, order, from, limit, text); 
	} 

	return students.length > 0 ? { status: 200, students } : { status: 204 };
}
exports.Block = async (req) =>
{
	if (!req.body.student_id) return { status: 400 };

	let result = null;

	if (parseInt(req.body.block)) { 
		result  = await model.blockStudent(req.body.student_id);  
		if (result) {
			let studentInfo = await model.getStudentPSM(req.body.student_id);
			let message = `Ваш аккаунт ${studentInfo.firstname, studentInfo.lastname} заблокирован`;
			await sendingAMessageOnAllServices(studentInfo, message);
			return { status: 200 }		
		} else { return { status: 204 } } 
	} else { 
		result  = await model.unblockStudent(req.body.student_id); 
		if (result) {
			let studentInfo = await model.getStudentPSM(req.body.student_id);
			let message = `Ваш аккаунт ${studentInfo.firstname, studentInfo.lastname} разблокирован`;
			await sendingAMessageOnAllServices(studentInfo, message);
			return { status: 200 }		
		} else { return { status: 204 } }
	}
}
exports.Stream = async (req) =>
{
	if (!req.body.student_id) return { status: 400 };

	let result;

	if (parseInt(req.body.stream)) 	{ result  = await model.openStream(req.body.student_id);	}
	else 														{ result  = await model.closeStream(req.body.student_id); }

	return result ? { status: 200 } : { status: 204 };
}
exports.UpdateStudentEmailActivate = async (req) =>
{
	if (!req.body.student_id) return { status: 400 };

	let result;

	if (parseInt(req.body.value)) 	{ result  = await model.deactivateStudentEmail(req.body.student_id); }
	else 														{ result  = await model.activateStudentEmail(req.body.student_id);	}

	return result ? { status: 200 } : { status: 204 };
}
exports.UpdateStudentPhoneActivate = async (req) =>
{
	if (!req.body.student_id) return { status: 400 };

	let result;

	if (parseInt(req.body.value)) 	{ result  = await model.deactivateStudentPhone(req.body.student_id); }
	else 														{ result  = await model.activateStudentPhone(req.body.student_id);	}

	return result ? { status: 200 } : { status: 204 };
}
exports.Update = async (req) =>
{
	if(!req.body.student_id) 	{ return { status: 400, message: 'no student_id' }; }
	if(!req.body.firstname) 	{ return { status: 400, message: 'no firstname'  }; }
	if(!req.body.lastname) 		{ return { status: 400, message: 'no lastname' 	 }; }
	if(!req.body.level)				{ return { status: 400, message: 'no level' 		 }; }
	if(!req.body.group_id) 		{ return { status: 400, message: 'no group_id'	 }; }
	if(!req.body.age)					{ return { status: 400, message: 'no age'			   }; }

	let result = await model.updateStudent(req.body.student_id,req.body.firstname,req.body.lastname,req.body.level,req.body.group_id,req.body.age);

	if(result) 	{ return { status: 200, message: 'success'}; }
	else 				{ return { status: 204, message: 'not updated'}; }
}
exports.Delete = async (req) =>
{
	if(!req.body.student_id) 	{ return { status: 400 }; };

	let studentInfo = await model.getStudentPSM(req.body.student_id);
	let result = await model.deleteStudent(req.body.student_id);
	
	if (result) {
		let message = `Ваш аккаунт ${studentInfo.firstname, studentInfo.lastname} удален администратором`;
		await sendingAMessageOnAllServices(studentInfo, message);
		return { status: 200 }		
	} else { return { status: 500 } }
}
exports.GetSelectedGroup = async (req) =>
{
	if (!req.body.student_id) 								{ return { status: 400, message: 'no student_id' }; }
	if (typeof req.body.all === 'undefined') 	{ return { status: 400, message: 'no all' }; }

	let group = '';

	if (parseInt(req.body.all) === 0) 				{	group  = await model.getSelectedSuitableGroup(req.body.student_id); } 
	else if (parseInt(req.body.all) === 1)		{ group  = await model.getSelectedAllGroup(); }
	else																			{ return { status: 400, message: 'no all correct value' }; }

	return group.length > 1 ? { status: 200, group } : { status: 204 };
}
exports.GetSrtList = async (req) =>
{
	let student_list = await model.getStudentList2(); 
	if (!student_list) { return {status: 204, message: 'no student_list'} }
	let rate_list  = await model.getSelectedRate(); 
	if (!rate_list) { return {status: 204, message: 'no rate_list'} }
	let teacher_list  = await model.getTeacherList2(); 
	if (!teacher_list) { return {status: 204, message: 'no teacher_list'} }

	return { status: 200, student_list, rate_list, teacher_list };
}
exports.GetSelectedTeacher = async (req) =>
{
	let teacher  = await model.GetSelectedAllTeacher(); 
	return teacher.length > 1 ? { status: 200, teacher } : { status: 204 };
}
exports.GetSelectedRate = async (req) =>
{
	let rate  = await model.getSelectedRate(); 
	return rate.length > 1 ? { status: 200, rate } : { status: 204 };
}
exports.GetSelectedLevel = async () => 
{
	let level  = await model.getSelectedLevel(); 
	return level.length > 0 ? { status: 200, level } : { status: 204 };
}
exports.GetStudentAllInfo = async (req) =>
{
	if (!req.body.student_id) 		{ return { status: 400, message: 'no student_id' }; }

	let student  									= await model.getStudentInfo(req.body.student_id);
	let level  										= await model.getSelectedLevel();
	let learningProcessMainInfo 	= await model.getLearningProcessMainInfo(req.body.student_id);
	let learningProcessChartInfo 	= await model.getLearningProcessChartInfo(req.body.student_id);
	let regMainInfo 							= await model.getRegMainInfo(req.body.student_id);
	let regSheduleDay 						= await model.getRegSheduleDay(req.body.student_id);
			regSheduleDay 						= await regSheduleDayParse(req.body.student_id, regSheduleDay);

	if (!student.guide) {
		let str = await generateId(5);
				str = str+'a';
		let updated = await model.updateStudentGuide(req.body.student_id, str);
		console.log('updated',updated)
		if (updated) { student.guide = str; }
	}

	return 	student ? { status: 200, student,learningProcessMainInfo,learningProcessChartInfo,regMainInfo,regSheduleInfo:regSheduleDay,level } 
									: { status: 204 };
}

exports.GetVisitHistory = async (req) =>
{
	if (!req.body.student_id) 		{ return { status: 400, message: 'no student_id' }; }
	if (parseInt(req.body.from) == NaN && parseInt(req.body.to)) { return { status: 400, message: 'no from or to' }; }

	let order = 'desc';
	if (parseInt(req.body.order)) { order = 'asc' }

	let visitHistory							= await model.getVisitHistory(req.body.student_id, order, parseInt(req.body.from), parseInt(req.body.to));

	return visitHistory ? { status: 200, visitHistory } : { status: 204 };
}

exports.GetStudentBasicInfo = async (req) =>
{
	if (!req.body.student_id) 		{ return { status: 400, message: 'no student_id' }; }

	let student = await model.getStudentInfo(req.body.student_id);
	let level  	= await model.getSelectedLevel();

	return student ? { status: 200, student, level } : { status: 204 };
}
exports.GetLearningProcess = async (req) =>
{
	if (!req.body.student_id) 		{ return { status: 400, message: 'no student_id' }; }

	let learningProcessMainInfo 	= await model.getLearningProcessMainInfo(req.body.student_id);
	let learningProcessChartInfo 	= await model.getLearningProcessChartInfo(req.body.student_id);

	return learningProcessMainInfo ? { status: 200, learningProcessMainInfo,learningProcessChartInfo } : { status: 204 };
}
exports.GetRegInfo = async (req) =>
{
	if (!req.body.student_id) 		{ return { status: 400, message: 'no student_id' }; }

	let regMainInfo 							= await model.getRegMainInfo(req.body.student_id);
	let regSheduleDay 						= await model.getRegSheduleDay(req.body.student_id);
			regSheduleDay 						= await regSheduleDayParse(req.body.student_id, regSheduleDay);

	return regMainInfo ? { status: 200, regMainInfo,regSheduleInfo:regSheduleDay } : { status: 204 };
}
exports.UpdateStudentGroup = async (req) =>
{
	if (!req.body.student_id) 		{ return { status: 400, message: 'no student_id' }; }
	if (!req.body.group_id) 			{ return { status: 400, message: 'no group_id' }; }

	let result = await model.updateStudentGroup(req.body.student_id, req.body.group_id);

	if (result) {
		let studentInfo = await model.getStudentPSM(req.body.student_id);
		let chartInfo = await model.getChartInfo(req.body.student_id);
		let utsDateSecond = null;
		let dt = null; 
		let message = '';
		if (chartInfo.start) {
			utsDateSecond = await computedUtsTime(studentInfo.timeDifference, chartInfo.start);
			dt = await getUtsDateString(utsDateSecond);
			message = `Вы переведены в группу ${chartInfo.group_name}. Дата следующего занятия ${dt}.`;
		} else {
			message = `Вы переведены в группу ${chartInfo.group_name}.`;
		}
		await sendingAMessageOnAllServices(studentInfo, message);
		return { status: 200 }		
	} else { return { status: 204 } }
}
exports.UpdateStudentChart = async (req) =>
{
	if (!req.body.chart_id) 			{ return { status: 400, message: 'no.chart_id' }; }
	if (!req.body.start) 					{ return { status: 400, message: 'no.start' }; }
	if (!req.body.finish) 				{ return { status: 400, message: 'no.finish' }; }
	if (!req.body.lesson) 				{ return { status: 400, message: 'no.lesson' }; }

	let result = await model.updateStudentChart(req.body.chart_id,req.body.start,req.body.finish,req.body.lesson);

	if (result) {
		let studentList = await model.getStudentByChartId(req.body.chart_id);
		for (let i = 0; i < studentList.length; i++) {
			let studentInfo = await model.getStudentPSM(studentList[i].student_id);
			let chartInfo = await model.getChartInfo(studentList[i].student_id);
			console.log('chartInfo.start',chartInfo.start)
			let utsDateSecond = await computedUtsTime(studentInfo.timeDifference, chartInfo.start);
			let dt = await getUtsDateString(utsDateSecond);
			let message = `Ваше расписание изменено. Дата следующего занятия ${dt}.`;
			await sendingAMessageOnAllServices(studentInfo, message);
		}
		return { status: 200 }		
	} else { return { status: 204 } }
}
exports.UpdateStudentAllCharts = async (req) =>
{
	if (!req.body.data) 					{ return { status: 400, message: 'no data' }; }
	if (!req.body.group_id) 					{ return { status: 400, message: 'no group_id' }; }

	let data = JSON.parse(req.body.data);
	let updated = false;
	let deleted = false;
	let created = false;

	let studentList = await model.getStudentByChartId(data[0].chart_id);

	for (let i = 0; i < data.length; i++) {
		if (data[i].deleted) {
			let d = await model.deleteStudentChart(data[i].chart_id);
			if (d) { deleted = true }
		} else {
			if (data[i].chart_id) {
				let e = await model.updateStudentChart(data[i].chart_id,data[i].start,data[i].finish,data[i].lesson);
				if (e) { updated = true } 
			} else {
				let n = await model.createStudentChart(req.body.group_id,data[i].start,data[i].finish,data[i].lesson);
				if (n) { created = true } 			
			}
		}
	}

	if (updated || created) {
		for (let i = 0; i < studentList.length; i++) {
			let studentInfo = await model.getStudentPSM(studentList[i].student_id);
			let chartInfo = await model.getChartInfo(studentList[i].student_id);
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
exports.UpdateStudentLevel = async (req) =>
{
	if (!req.body.student_id) 		{ return { status: 400, message: 'no student_id' }; }
	if (!req.body.level_id) 			{ return { status: 400, message: 'no group_id' }; }

	let result = await model.updateStudentLevel(req.body.student_id, req.body.level_id);

	return result ? { status: 200 } : { status: 204 };
}
exports.DeleteStudentChart = async (req) =>
{
	if(!req.body.chart_id) 				{ return { status: 400 }; };

	let result = await model.deleteStudentChart(req.body.chart_id);

	return result ? { status: 200 } : { status: 204 };
}
exports.UpdateStudentRegTeacher = async (req) =>
{
	if (!req.body.student_id) 		{ return { status: 400, message: 'no student_id' }; }
	if (!req.body.teacher_id) 		{ return { status: 400, message: 'no teacher_id' }; }

	let result = await model.updateStudentRegTeacher(req.body.student_id, req.body.teacher_id);

	return result ? { status: 200 } : { status: 204 };
}
exports.UpdateStudentGroupTeacher = async (req) =>
{
	if (!req.body.group_id) 		{ return { status: 400, message: 'no group_id' }; }
	if (!req.body.teacher_id) 		{ return { status: 400, message: 'no teacher_id' }; }

	let result = await model.updateStudentGroupTeacher(req.body.group_id, req.body.teacher_id);

	return result ? { status: 200 } : { status: 204 };
}
exports.UpdateStudentGroupRate = async (req) =>
{
	if (!req.body.group_id) 		{ return { status: 400, message: 'no group_id' }; }
	if (!req.body.rate_id) 		{ return { status: 400, message: 'no rate_id' }; }

	let result = await model.updateStudentGroupRate(req.body.group_id, req.body.rate_id);

	return result ? { status: 200 } : { status: 204 };
}
exports.UpdateStudentPassword = async (req) =>
{
	if (!req.body.student_id) 		{ return { status: 400, message: 'no student_id' }; }

	let salt 		= await bcrypt.genSalt(10);
	let hash 		= await bcrypt.hash(config.deafultPassword, salt);
	let result 	= await model.updateStudentPassword(hash, req.body.student_id);

	if (result) {
		let studentInfo = await model.getStudentPSM(req.body.student_id);
		let message = `Ваш пароль был изменён на - "${config.deafultPassword}". Администрация SmartChat.`;
		await sendingAMessageOnAllServices(studentInfo, message);
		return { status: 200 }
	} else { { status: 204 } }
}
exports.UpdateStudentSmsOn = async (req) =>
{
	if (!req.body.student_id) return { status: 400 };

	let result;

	if (parseInt(req.body.value)) 	{ result  = await model.enableStudentSmsOn(req.body.student_id);	}
	else 														{ result  = await model.disableStudentSmsOn(req.body.student_id); }

	return result ? { status: 200 } : { status: 204 };
}
exports.UpdateStudentMailOn = async (req) =>
{
	if (!req.body.student_id) return { status: 400 };

	let result;

	if (parseInt(req.body.value)) 	{ result  = await model.enableStudentMailOn(req.body.student_id);	}
	else 														{ result  = await model.disableStudentMailOn(req.body.student_id); }

	return result ? { status: 200 } : { status: 204 };
}
exports.CreateShedule = async (req) => {
	if(!req.body.student_id) 	return {status: 400, message: 'no student_id'}
	if(!req.body.mas)					return {status: 400, message: 'no mas'}
	if(!req.body.rate_id)					return {status: 400, message: 'no rate_id'}
	if(!req.body.teacher_id)					return {status: 400, message: 'no teacher_id'}


	let student = await studentModel.getStudent(req.body.student_id)
	let rate = await rateModel.getRate(req.body.rate_id)

	return await createSchedule(student, req.body.mas, rate, req.body.teacher_id)? {status: 200} : {status: 202}
}

exports.getTeachersList = async function (req) {
	if(!req.body.rate) 		return {status: 418, message: 'no rate'}
	if(!req.body.mas) 	return {status: 418, message: 'no mas'}

	let accept = await studentModel.acceptToRequest(req.body.myId)
	if(!accept) return {status: 202, message: 'no access'}

	let mas = req.body.mas.split(',')

	let rate = await rateModel.getRate(req.body.rate)

	if(!rate) return {status: 201, message: 'invalid rate'}

	let lessonNumber = rate.lessons

	let min = lessonNumber>1 ? lessonNumber/4 : 1 

	let teachers = await teacherModel.getTeachers()
	if(!teachers.length>0) return {status: 202, message: 'no teachers'}

	let matched=[]

	for (let i=0; i<teachers.length; i++) 
		if(await teacherMatched(teachers[i].teacher_id, mas, min)) matched.push(teachers[i])
	
	if (matched.length>0) return { status: 200, teachers: matched }
	else return { status: 202, message: 'no one of the teachers matched' }
}

/* controller functions */ 

async function regSheduleDayParse(student_id, data) {
	if (data.length>0) {
		for (let i = 0; i < data.length; i++) {
			let time = await model.getRegSheduleTime(student_id, data[i].nday);
			if (time.length>0) { data[i].time = time }
		}
		return data;
	} else { return [] }
}


async function createSchedule(student, mas, rate, teacherId) {

	let groupId = await groupModel.addGroup(teacherId, student.firstname + ' ' + student.lastname, rate.rate_id)
	if(!groupId) throw new Error('addGroup error')

	await studentModel.updateGroup(student.student_id, groupId)

	//[1,2,1,	2,3,4]
	let date = new Date()
	while(date.getMinutes() != 30 && date.getMinutes() != 0) date = new Date(date.valueOf() + 1000*60)

	let count = 0
	let enough = false
	while(!enough) {
		try {
			while(await DateIsBad(date) || await DateNOTInMas(mas, date)) date = new Date(date.valueOf() + 1000*60*30)

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

async function DateIsBad(date, teacher) {
  let sConf = await configModel.getConfig()
  if(!teacher) teacher = sConf.quickTeacher
  
  let graph = await graphModel.getTeacherGraph(teacher)
	if(!graph.length) throw new Error('no graph')
	 
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

async function DateNOTInMas(mas, date) {
  for(i=0; i<mas.length; i=i+3) 
    if(mas[i] == date.getUTCHours() && mas[i+2] == date.getUTCDay() && date.getUTCMinutes() == 0)  
      return false
  return true
}

async function teacherMatched(teacher, request, min) {
	let cnt = 0

	let graph = await graphModel.getTeacherGraph(teacher)
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