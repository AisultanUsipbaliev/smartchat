let studentModel = require('../../apiModels/student')

exports.getStudent = async (req) => {
	if(!req.body.student_id) return {status: 418, message: 'no student_id'}
	let student = await studentModel.getTeacherStudent(req.body.myId, req.body.student_id)
	return student? {status: 200, student} : {status: 404}
}

exports.getStudents = async (req) => {
	return {status: 200, students: await studentModel.getTeacherStudents(req.body.myId)}
}