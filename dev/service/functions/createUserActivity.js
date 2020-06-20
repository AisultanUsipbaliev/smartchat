let activityModel = require('../../apiModels/activity')

module.exports = async function(userId, isteacher, groupId) {
	await log('createActivity started')
	let date = new Date()
	date = new Date(`${date.getFullYear()}-${Number(date.getMonth())+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 30? '00': '30'}`)
	
	let start = date.valueOf()
	let brek = start + 3600000 // 1 час

 	while(start < brek) {
 		let finish = start + 300000 // 5 минут
 		let inserted = await activityModel.add(userId, start, finish, isteacher, groupId)
 		if (!inserted) await log('Can\'t add userActivity -> activityModel.add', {}, 1)
 		start = finish
 	}

 	await log(`created activity for ${isteacher? 'teacer' : 'student'}: #${userId}`)
}