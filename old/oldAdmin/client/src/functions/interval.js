function toServer(mas) {	
	let res = []
	for(let i=0;i<mas.length;i+=3) res = res.concat(getServerInterval(mas[i],mas[i+1],mas[i+2]))
	return toUnion(res)
}

function toClient(mas) {
	let res = []
	for(let i=0;i<mas.length;i+=3) res = res.concat(getClientInterval(mas[i],mas[i+1],mas[i+2]))
	return toUnion(res)
}

function toUnion(mas) {
	let result = []
	for(let day = 0; day < 7; day++) {
		let forDay = []

		for(let i = 2; i<mas.length; i+=3) {
			if(mas[i] == day) {
				forDay.push(mas[i-2])
				forDay.push(mas[i-1])
				forDay.push(mas[i])
			}
		}

		//тут график на день [1, 8, 1, 8, 20, 1, 20, 21, 1] -> [1,20,1] для наглядности
		let buffer = forDay
		// console.log('forday: ', forDay)
		for(let i = 0; i<forDay.length; i+=3) {
			for(let j = 1; j<forDay.length; j+=3) {
				if(forDay[i] == forDay[j]) {
					let founded = [forDay[j-1], forDay[i+1], day]
					delete forDay[j-1]
					delete forDay[j]
					delete forDay[j+1]
					delete forDay[i]
					delete forDay[i+1]
					delete forDay[i+2]
					buffer = []
					for(let l = 0; l<forDay.length; l++) 
						if(forDay[l]) buffer.push(forDay[l])
					buffer = buffer.concat(founded)
				}
				forDay = buffer
				// console.log(forDay)
			}
		}
		if(forDay.length) result = result.concat(forDay)
	}
	return result
}

function getServerInterval(start, finish, day) {
	start 	= Number(start)
	finish 	= Number(finish)
	day 	= Number(day)

	if(start >= finish) return 'invalid'

	let date = new Date()
	while (true) {
		if(date.getDay() == day) break
		else date = new Date(date.valueOf() + 1000*60*60*24)
	}

	let startDay = new Date(`${date.getFullYear()}-${Number(date.getMonth() + 1)}-${date.getDate()} ${start}:00`)
	let finishDay = new Date(`${date.getFullYear()}-${Number(date.getMonth() + 1)}-${date.getDate()} ${finish}:00`)

	let resultStart = startDay.getUTCHours()
	startDay = startDay.getUTCDay()

	let resultFinish = finishDay.getUTCHours()
	finishDay = finishDay.getUTCDay()

	if(finishDay == startDay) return [resultStart, resultFinish, startDay]
	else if(resultFinish != 0) return [resultStart, 24, startDay, 0, resultFinish, finishDay]
	else return  [resultStart, 24, startDay]
}

function getClientInterval(start, finish, day) {
	start 	= Number(start)
	finish 	= Number(finish)
	day 	= Number(day)
	
	if(day > 6 || day < 0) return console.log('day: ', day)
	let date = new Date()
	while(true) {
		if(date.getUTCDay() == day) break
		else date = new Date(date.valueOf() + 1000*60*60*24)
	}

	let startDate = new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(), start, 0, 0))
	let finishDate = new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(), finish, 0, 0))
 
	let resultStart 	= startDate.getHours()
	let resultFinish 	= finishDate.getHours()
	let startDay 		= startDate.getDay()
	let finishDay	 	= finishDate.getDay()

	if(finishDay == startDay) return [resultStart, resultFinish, startDay]
	else if(resultFinish != 0) return [resultStart, 24, startDay, 0, resultFinish, finishDay]
	else return  [resultStart, 24, startDay]
}

export { toServer, toClient, toUnion }