let chatModel 		= require('../../apiModels/chat'),
	groupModel		= require('../../apiModels/group'),
	studentModel 	= require('../../apiModels/student')

let templateController = require('../controllers/template')

exports.getChats = async (req) => {
	let chats = await groupModel.getTeacherGroups(req.body.myId)

	for(let i=0; i<chats.length; i++) {
		let student = await studentModel.findGroup(chats[i].group_id)
		if (student.length) { chats[i].student = await studentModel.getProfile(student[0].student_id) } 
		else { chats[i].student = null }
		let lastMessage = await chatModel.getTeacherChat(chats[i].group_id)
		if (lastMessage.length) { chats[i].lastMessage = lastMessage[0] } 
		else { chats[i].lastMessage = {} }
		let unread = await chatModel.getTeacherUnreadMesCount(chats[i].group_id)
		chats[i].newMes = unread;
	}

	chats.sort(function (prev, next) {
		let a = prev,
			b = next

		if (!a.lastMessage.dt) { a = { lastMessage: { dt: 0 } } } 
		if (!b.lastMessage.dt) { b = { lastMessage: { dt: 0 } } } 
		if ((new Date(a.lastMessage.dt).valueOf()) > (new Date(b.lastMessage.dt).valueOf())) { return -1 }
		if ((new Date(a.lastMessage.dt).valueOf()) < (new Date(b.lastMessage.dt).valueOf())) { return 1 }
		return 0;
	});

	return {status: 200, chats} 
}

exports.searchChat = async (req) => {
	if(!req.body.text) return {status: 418, message: 'no text'}
	let chats = await groupModel.findName(req.body.myId, req.body.text)
	for(i=0; i<chats.length; i++)
		chats[i].students 	= await studentModel.findGroup(chats[i].group_id)
	return {status: 200, chats}
}

exports.getChat = async (req) => {
	if(!req.body.group_id) return {status: 418, messages: 'no group_id'}

	let group = await groupModel.getTeacherGroup(req.body.myId, req.body.group_id)
	if(!group) return { status: 404, message: 'no such group' }

	let messages = []
	let founded = {}

	if (req.body.mes_id) {
		messages = await chatModel.getTeacherPartChat(req.body.group_id, req.body.mes_id)
	} else {
		messages = await chatModel.getTeacherChat(req.body.group_id)
		founded = await templateController.findTemplates(req)

		messages.sort(function (a, b) {
		  if (a.dt > b.dt) {
		    return 1;
		  }
		  if (a.dt < b.dt) {
		    return -1;
		  }
		  return 0;
		})
	}
	return messages.length? {status: 200, messages, templates: founded.templates?founded.templates:[]}: {status: 202} 
}

exports.searchMessage = async (req) => {
	if(!req.body.text) 		return {status: 418, message: 'no text'}
	if(!req.body.group_id)	return {status: 418, message: 'no group_id'}

	let group = await groupModel.getTeacherGroup(req.body.myId, req.body.group_id)
	if(!group) return { status: 404, message: 'no such group' }

	let messages = await chatModel.findTeacherMessages(req.body.group_id, req.body.text)
	return messages.length? {status: 200, messages}: {status: 202} 
}