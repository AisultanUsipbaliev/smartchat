let model = require('../models/chat');

exports.get = async function (req)
{	
	if(!req.body.group_id) return {status: 418, message: 'no group_id'};	
	
	let chat = null;
	if (!req.body.mes_id) 	chat = await model.getChat(req.cookies['SAI'], req.body.group_id);	
	else 					chat = await model.getPartChat(req.cookies['SAI'], req.body.group_id, req.body.mes_id);	
	
	await model.isreadChat(req.body.group_id);

	if(chat.length > 0)	return {status: 200, body: chat}
	else 				return {status: 202, message: 'empty'}
}
  
exports.getChat = async function (req) {	

	let now = (new Date()).valueOf()
	let gr 	= await model.getGrByTeacherId(req.cookies['SAI'], now);
	if(gr.length>0)	return {status: 200, body: gr}
	else 			return {status: 202, message: 'not found!'}
}

exports.getMiss = async function (req)
{	
	let body 	= await model.getGrAndCountMess();
	if(body.length>0)	return {status: 200, body}
	else 				return {status: 202, message: 'not found!'}
}

exports.getTest = async function (req)
{	
	if (!req.body.group_id) 		return {status: 418, message: 'group_id is undefined'};
		
	let test = await model.getTestByTeacherIdAndGroupId(req.cookies['SAI'], req.body.group_id);

	if(test.length > 0) 			return {status: 200, body: test};
	else 							return {status: 202, message: 'not found'};
}

exports.getHomework = async function (req)
{	
	if(!req.body.group_id)			return {status: 418, message: 'group_id is undefined'};

	let selected = await model.getHomework(req.body.group_id);
	
	if(selected.length > 0) return {status: 200, body: selected}
	else					return {status: 202, message: 'no missings'}
}

 