let chartModel = require('../../apiModels/chart'),
	levelModel = require('../../apiModels/level'),
	studentModel = require('../../apiModels/student')

exports.getNearLessons = async (req) => {
	
	// let begin 	= (new Date()).valueOf(),
	// 	end		= begin + 172800000 // + 2 дня

	// let lessons = await chartModel.getTeacherChartBetween(req.body.myId, begin, end)
	// 	lessons = await setLevelName(lessons)

	let begin 	= (new Date()).valueOf()

	let lessons = await chartModel.getTeacherChartBetween2(req.body.myId, begin)
		lessons = await setLevelName(lessons)

	return {status: 200, lessons: lessons}
}

exports.getSchedule = async (req) => {
	
	let schedule = !req.body.end || !req.body.begin? 
	await chartModel.getTeacherChart(req.body.myId):
	await chartModel.getTeacherChartBetween(req.body.myId, req.body.begin, req.body.end)

	schedule = await setLevelName(schedule)

	return {status: 200, schedule }
}

async function setLevelName(schedule) {
	for (let i = 0; i < schedule.length; i++) {
		let levelId = (await studentModel.findGroup(schedule[i].group_id))[0].lvl
		schedule[i].level = (await levelModel.getLevel(levelId))[0]
	}
	return schedule
} 