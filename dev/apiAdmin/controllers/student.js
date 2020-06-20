const generateId	= require('../../apiFunctions/generateId');

const studentModel 	= require('../../apiModels/student'),
	  levelModel 	= require('../../apiModels/level');

exports.getStudents = async (req) => {

	if (req.body.unblockedStudents) {
		let students  = await studentModel.getUnblockedAndNoGroupStudents(); 
		return students.length ? { status: 200, students } : { status: 204 };
	}

	if (!req.body.order)   							{ return { status: 400, message: 'no order'  } }
	if (!req.body.column && req.body.column !== 0) 	{ return { status: 400, message: 'no column' } }
	if (!req.body.from && req.body.from !== 0) 	  	{ return { status: 400, message: 'no from'   } }
	if (!req.body.limit && req.body.limit !== 0)   	{ return { status: 400, message: 'no limit'  } }

	let column = parseInt(req.body.column),
		from = parseInt(req.body.from),
		limit = parseInt(req.body.limit);

	let order = '',
		text = '',
		filter = null,
		students = null;

	if (req.body.order == 'true') { order = 'desc' } else if (req.body.order == 'false') { order = 'asc' }

	if (req.body.text && (typeof req.body.text) === "string") { text = req.body.text.trim(); }

	if (parseInt(req.body.filter) === 0 || parseInt(req.body.filter) === 1) { 
		students = await studentModel.getFilteredStudentList(parseInt(req.body.filter), column, order, from, limit, text); 
	} else { 
		students = await studentModel.getStudentList(column, order, from, limit, text); 
	} 

	return students.length ? { status: 200, students } : { status: 204 };
}
exports.getStudent = async (req) => {
	if (!req.body.student_id) return { status: 400, message: 'no student_id' } 
	if (!+req.body.student_id)  return { status: 400, message: 'wrong student_id type' }

	let student = await studentModel.getProfile(req.body.student_id)
	if(!student) return { status: 404, message: 'student not found' }
	
	let	level  						= await levelModel.getAllLevels(),
		learningProcessMainInfo 	= await studentModel.getLearningProcessMainInfo(req.body.student_id),
		learningProcessChartInfo 	= await studentModel.getLearningProcessChartInfo(req.body.student_id)

	if (!student.guide) {
		let str = (await generateId(5)) + 'a';
		let updated = await studentModel.updateStudentGuide(req.body.student_id, str);
		if (updated) { student.guide = str }
	}

	return 	student ? { status: 200, student,learningProcessMainInfo,learningProcessChartInfo,level } : { status: 204 }
}

exports.streamState = async (req) => {
	if (!req.body.student_id) return { status: 400, message: 'no student_id' }

	let stream = (parseInt(req.body.stream)) ? 1 : 0;

	let result = await studentModel.updateStream(req.body.student_id, stream);

	return result ? { status: 200 } : { status: 204 }
}