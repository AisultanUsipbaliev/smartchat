let chatModel 		= require('../../apiModels/chat')
let studentModel 	= require('../../apiModels/student')

exports.getChat = async function(req) {
	let student = await studentModel.getStudent(req.body.myId)
	if(!student.group_id) return {status: 202, message: 'no chat'}
	
	let chat = []
	if(!req.body.mes_id) chat = await chatModel.getStudentChat(student.group_id, req.body.myId)
	else chat = await chatModel.getStudentPartChat(student.group_id, req.body.myId, req.body.mes_id)
	return {status: 200, chat}
}  
exports.searchMessages = async function(req) {
	if(!req.body.text) return {status: 202, message: 'no text'}
	let student = await studentModel.getStudent(req.body.myId)
	if(!student.group_id) return {status: 202, message: 'no chat'}
	let text = req.body.text.trim()
	let messages = await chatModel.findStudentMessages(text, student.group_id, req.body.myId)
	return {status: 200, messages}
}  