let studentModel = require('../../apiModels/student')

module.exports = async function(string, studentId) {
	let student = await studentModel.getStudent(studentId)
	
	if(!string) string = `${config.hostname}/guide?code=${student.guide}`
	
	string = string.replace('${toweb}', `${config.hostname}/guide?code=${student.guide}`)
	string = string.replace('${tostart}', 'https://start.smartchat.kz')

	return string
}