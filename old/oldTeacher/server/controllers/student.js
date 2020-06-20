let model = require('../models/student');

exports.getStudent = async function (req) {	
	if(!req.body.student_id) {
		let students = await model.getStudentsByTeacherId(req.cookies['SAI']);
		if(students.length > 0)	 	return {status: 200, students: students};
		else						return {status: 202, message: 'not found'};
	} else {
		let student = await model.getStudentByStudentId(req.body.student_id);
		if(!student.length > 0) 	return {status: 202, message: 'not found'}
		else 						return {status: 200, student: student}
	}
} 