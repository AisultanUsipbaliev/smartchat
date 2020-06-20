let model = require('../models/notice');

exports.deleteNotice = async function(req)
{
	if(!req.body.id)	return {status: 418, message: 'no id'};

	let res = await model.deleteNotice(req.body.id);
	if(res) 			return {status: 200, message: 'success'};
	else 				return {status: 202, message: 'not found'};
}
 
exports.getNotices = async function(req)
{
	let notices 		= await model.getNotices(req.body.myId);
	let homeworksCount 	= await model.getHomeworksCount(req.body.myId);
	let testsCount 		= await model.getTestsCount(req.body.myId);
	let needFeedback 	= await model.getNeedFeedback(req.body.myId);
	let isActivated 	= (await model.getStudent(req.body.myId)).activated;
	let email			= (await model.getStudent(req.body.myId)).email;

	await checkLate(req.body.myId);

	return {status:  200, body: notices, homeworksCount, testsCount, needFeedback, isActivated, email};
}

exports.getUnread = async function(req)
{
	let unreadCount = await model.getUnreadCount(req.body.myId);
	if(unreadCount > 0) 	return {status: 200, unreadCount};
	else 					return {status: 202, message: 'no unread mes'};
}

//Опоздашки
async function checkLate(id)
{
	let date 	= new Date();
	let now 	= date.getUTCHours();

	let lates = await model.getLate(id, now);
	if(!lates.length) lates = await model.getLate(id, now - 1);

	for(let i = 0; i < lates.length; i++)
	{
		let studentInfo = await model.getStudent(id);

		await writeAction( `Студент ${studentInfo.firstname} ${studentInfo.lastname} опоздал(-а) на занятие.`);
		await model.deleteLate(lates[i].id);
	}
}