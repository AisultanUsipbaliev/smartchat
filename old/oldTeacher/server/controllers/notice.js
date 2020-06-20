let model = require('../models/notice');

let priceModel		= require('../model/price')
let balanceModel 	= require('../model/balance')
let configModel		= require('../model/config')
let teacherModel 	= require('../model/teacher')
let groupModel 		= require('../model/group')

exports.getNotices = async function (req)
{	
	let select_notice 	= await model.getNoticeByTeacherId(req.cookies['SAI']);
	let select_req 		= await model.getReqByTeacherId(req.cookies['SAI']);
	let select_chat 	= await model.getChatByTeacherId(req.cookies['SAI']);
	let select_results 	= await model.getResultByTeacherId(req.cookies['SAI']);
	let select_graph 	= await model.getGraphByTeacherId(req.cookies['SAI']);
	let delete_notice 	= await model.deleteNoticeByTeacherId(req.cookies['SAI']);

	await checkTeacherLate(req.cookies.SAI);
	await checkTeacherReq(req.cookies.SAI);
	
	return {
		status: 200, 
		message: 'success', 
		notice: select_notice, 
		req_count: select_req.length, 
		sms_count: select_chat.length, 
		tests: select_results.length, 
		graph: select_graph.length
	}
}

async function checkTeacherLate(id) {
	let teacher = await teacherModel.getTeacher(id)

	let date 	= new Date()
	let hr 		= date.getUTCHours()

	let lates = await model.getLate(id, hr)
	if(!lates.length) lates = await model.getLate(id, hr - 1);
	
	for(let i = 0; i < lates.length; i++) {
		let group 	= await groupModel.getGroup(lates[i].group_id)

		await writeAction( `Преподаватель ${teacher.email} опоздал(-а) на занятие с ${group.group_name}. ` , 1)
		await giveMeYourMoney(teacher, group, `Вы опоздали на занятие с ${group.group_name}`)
		await model.deleteLate(lates[i].id)
	}
}

async function checkTeacherReq(id) {
	let date = new Date();
	let today 	= date.getFullYear() + '-' + Number(date.getMonth() + 1) + '-' + date.getDate();
	let day = date.getDate();
	
	let teacherInfo = await model.getTeacher(id);
	let oldReqs = await model.getOldReqs(id, today);

	for(let i = 0; i<oldReqs.length; i++)
	{
		let reqDay = (new Date(oldReqs[i].req_dt)).getDate();
		let result = day - reqDay;

		if(result > 3) 
		{
			let studentInfo = await model.getStudent(oldReqs[i].student_id);
			await writeAction( `Преподаватель ${teacherInfo.email} не принимает заявку от студента ${studentInfo.firstname} ${studentInfo.lastname} более ${result} дней!` , 1);
		}
	}
}


async function giveMeYourMoney(teacher, group, comment) {

	// let config = await configModel.getConfig()
	let cost = -100
	await balanceModel.add(teacher.teacher_id, cost, comment)

}