let studentModel = require('../../apiModels/student')

module.exports = async function(studentId, currentLesson) {
	let rate = await studentModel.getStudentRate(studentId)
	await log('LESSONS IN THIS RATE : ' + rate.lessons)
	return currentLesson == rate.lessons
}
