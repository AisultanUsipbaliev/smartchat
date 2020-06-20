let model = require('../models/chat');

exports.getChat = async function(req) {
	let studentInfo = await model.getStudentInfoById(req.body.myId);
	if(studentInfo.group_id > 0) {
		let chat = null;

		if(!req.body.mes_id) 	chat = await model.getChat(studentInfo.group_id, req.body.myId);
		else 					chat = await model.getPartChat(studentInfo.group_id, req.body.myId, req.body.mes_id);

		await model.readChat(req.body.myId);
		if(chat && chat.length > 0) return {status: 200, body: chat};
		else 						return {status: 202, message: 'empty'};
	}
	else return {status: 201, message: 'student without group' };
}  