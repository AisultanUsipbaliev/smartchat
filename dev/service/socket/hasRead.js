let chatModel 		= require('../../apiModels/chat')
let unreadModel 	= require('../../apiModels/unread')
let studentModel 	= require('../../apiModels/student')

module.exports = async function(id, data) {
	try {
		if(!id) {
			if(config.production) throw new Error('invalid user')
			else return
		}
		if(!data.group_id && id[0] == 't') throw new Error('NO group_id'); 

		if(id[0] == 's') {
			
			data.group_id = (await studentModel.getStudent(id.substr(1))).group_id
			await unreadModel.delete(id.substr(1))
		
		} else await chatModel.setIsRead(data.group_id)
		

		let users = await chatModel.getUsers(data.group_id)
		
		for(i=0; i<users.length; i++) {
			if(id[0] == 't' && !users[i].isteacher)
				socket.clients.forEach(ws => {
					if(ws.userid == 's' + users[i].id) ws.send(JSON.stringify(data)) 
				})

			if(id[0] == 's' && users[i].isteacher)
				socket.clients.forEach(ws => {
					if(ws.userid == 't' + users[i].id) ws.send(JSON.stringify(data))
				})
		}
	}
	catch (err) {
		await sayMe('Socket::hasRead', {}, err.message)
	}
}