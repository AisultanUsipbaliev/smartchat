let chatModel = require('../../apiModels/chat')
let studentModel = require('../../apiModels/student')
let teacherModel = require('../../apiModels/teacher')
let activityModel = require('../../apiModels/activity')
let unreadModel = require('../../apiModels/unread')

module.exports = async function(id, data) {
	try {
		if(!id) {
			if(config.production) throw new Error('invalid user')
			else return
		}
		console.log(id[0])
		if(data.group_id == undefined && id[0] == 't') 	throw new Error('NO group_id')
		if(data.content == undefined) 					throw new Error('NO content')
		if(data.type == undefined) 						throw new Error('NO type')
		if(data.title == undefined) 					data.title = ''
		if(data.reference == undefined || Number(data.reference) < 1) data.reference = 0			

		data.sender = id.substr(1)
		data = await appendReference(data)
		data.isteacher = id[0] == 's'? 0:1

		let sender = data.isteacher ? 
			await teacherModel.getTeacher(id.substr(1)) : 
			await studentModel.getStudent(id.substr(1))

		data.group_id = data.isteacher? data.group_id : sender.group_id
		await activityModel.remove(data.sender, data.isteacher, (new Date()).valueOf())
		
		data.sender_name = data.isteacher? `${sender.login} ${sender.lastname}`:`${sender.firstname} ${sender.lastname}` 
		data.ava = sender.ava
		data.dt = (new Date()).valueOf()

		if(!data.isteacher && !sender.stream) 	await storeMessage(data)
		else 									await sendMessage(data)
	}
	catch(err) {
		await sayMe('sendMessage', {}, err)
	}
}

async function sendMessage(message) {
	let users = await chatModel.getUsers(message.group_id)
	message.delivered = 1
	message.mes_id = await chatModel.addMessage(message)

	for(let i = 0; i<users.length; i++) {

		if(!users[i].isteacher && users[i].id != message.sender) await unreadModel.add(message.mes_id, users[i].id)

		socket.clients.forEach(async (ws) => {
			if(users[i].isteacher&& ws.userid == 't'+users[i].id)  ws.send(JSON.stringify(message))
			if(!users[i].isteacher&& ws.userid == 's'+users[i].id) ws.send(JSON.stringify(message))
		})
	}
}

async function storeMessage(message) {
	message.delivered = 0
	message.mes_id = await chatModel.addMessage(message)

	socket.clients.forEach((ws) => {
		if(ws.userid == 's' + message.sender)
			ws.send(JSON.stringify(message))
	})
}

async function appendReference(data) {
	if(data.reference) {
		console.log(data.reference)
		let oldSms = await chatModel.getMessage(data.reference)
		if(oldSms) {
			console.log(oldSms)
			data.refContent = oldSms.content
			data.refType 	= oldSms.type
			data.refTitle 	= oldSms.title
			let sender = oldSms.isteacher? 
			await teacherModel.getTeacher(oldSms.sender_id) : 
			await studentModel.getStudent(oldSms.sender_id)
			data.refSender 	=  oldSms.isteacher? `${sender.login} ${sender.lastname}`:`${sender.firstname} ${sender.lastname}`
		}
	}
	return data
}