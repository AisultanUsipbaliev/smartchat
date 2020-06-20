let studentModel 	= require('../../apiModels/student')
let teacherModel 	= require('../../apiModels/teacher')
let chatModel 		= require('../../apiModels/chat')

module.exports = async function(id, data) {
	try {
		if(!id) {
			if(config.production) throw new Error('invalid user')
			else return
		}
		if(data.group_id == undefined && id[0] == 't') return 	
			
		data.isteacher 	= id[0] == 't'
		data.group_id 	= data.isteacher? data.group_id : (await studentModel.getStudent(id.substr(1))).group_id  

		if(!data.group_id) return
		let users = await chatModel.getUsers(data.group_id)

		let user = data.isteacher? 
		await teacherModel.getTeacher(id.substr(1)):
		await studentModel.getStudent(id.substr(1))

		data.sender_name = data.isteacher == 1 ? `${user.login} ${user.lastname}`:`${user.firstname} ${user.lastname}` 


		if(!data.isteacher && user.stream == 0) return
		else 
			for(let i = 0; i<users.length; i++) {
				socket.clients.forEach(async ws => {
					if(data.isteacher && !users[i].isteacher && ws.userid == 's' + users[i].id) ws.send(JSON.stringify(data))
					else if(!data.isteacher)
						if(users[i].isteacher && ws.userid == 't'+users[i].id) ws.send(JSON.stringify(data))
						else if(!users[i].isteacher && ws.userid == 's' + users[i].id && users[i].id != id.substr(1)) 
							ws.send(JSON.stringify(data))
				})
		}
	}
	catch(err) {
		await sayMe('Socket::iAmWriting', {}, err.message)
	}
}