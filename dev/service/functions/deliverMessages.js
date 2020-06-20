let chatModel = require('../../apiModels/chat'),
	unreadModel = require('../../apiModels/unread')

module.exports = async function(groupId, students, teacher) {
	await log('deliverMassages started')

	let groupMessages = await chatModel.getUndelivered(groupId)
	if(!groupMessages) return log('deliverMassages error: no groupMessages', {groupId}, 1)

	for(let z = 0; z<groupMessages.length; z++) {
		let mes = groupMessages[z]
		mes.delivered = 1

		socket.clients.forEach( async (ws) => {
			if (ws.userid == 't' + teacher.teacher_id) ws.send(JSON.stringify(mes));
			
			for(let j = 0; j<students.length; j++) {
				if(ws.userid == 's' + students[j].student_id && students[j].student_id != mes.sender_id) {
					ws.send(JSON.stringify(mes));
					let inserted = await unreadModel.add(mes.mes_id, students[j].student_id)
					if (!inserted) await log('Can\'t add unread -> unreadModel.add', {}, 1)
				}
			}
		});
	}

	let deliverUnsent = chatModel.setDelivered(groupId)
	if (deliverUnsent) await log('UNSENT MESSAGES ARE DELIVERED')
	else await log('NO UNSENT MESSAGES OR ERROR')
}