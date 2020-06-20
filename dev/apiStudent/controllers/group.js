let rateModel 		= require('../../apiModels/rate')
let groupModel 		= require('../../apiModels/group')
let studentModel 	= require('../../apiModels/student')
let teacherModel 	= require('../../apiModels/teacher')

exports.getGroup = async function(req) {
	let student = await studentModel.getStudent(req.body.myId)
	if(!student.group_id) return {status: 202, message: 'no group'}

	let group = await groupModel.getGroup(student.group_id)
	if(!group) throw new Error(`У студента ${student.student_id} несуществующая группа ${student.group_id}`)

	let teacher = await teacherModel.getTeacher(group.teacher_id)
	if(!teacher) throw new Error(`У группы ${group.group_id} несуществующий препод ${group.group_id}`)

	let students = await studentModel.findGroup(group.group_id)

	return { status: 200, group, 
		teacher: {
			firstname 	: teacher.login,
			lastname 	: teacher.lastname,
			ava 		: teacher.ava,
			lastVisit 	: teacher.lastVisit
		}, students}
}