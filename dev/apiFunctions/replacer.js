let SQL 	= require('./query'),
	getId	= require('./generateId')

module.exports = async function(string, studentId) {
	let student = await SQL('select * from student where student_id = ?', studentId)
	let token = await getId(5) + 'a'
	let updated = false

	if(!student.guide || !student.guide.length) {
		await SQL('update student set guide = ?, guideUsed = 0 where student_id = ?', [token, studentId])
		updated = true
	}
	
	if(!string) string = `${config.hostname}/guide?code=${updated? token:student.guide}`
	
	string = string.replace('${toweb}', `${config.hostname}/guide?code=${updated? token:student.guide}`)
	string = string.replace('${tostart}', 'https://start.smartchat.kz')

	return string
}