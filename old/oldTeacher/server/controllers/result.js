let model = require('../models/result');

exports.getResult = async function (req)
{	
	let result = await model.getResultByTeacherId(req.cookies['SAI']);

	if(result.length > 0) 
	{
		for (var i = 0; i < result[0].length; i++) await model.setIsreadResult(result[i].result_id);
        return {status: 200, result: result};
	}
	else return {status: 202, message: 'not found'};					
}

exports.createResult = async function (req)
{	
	if(!req.body.group || !req.body.test) 		return {status: 418, message: 'no group or no test'};

  	let student = await model.getStudentIdByGroupId(req.body.group);

  	if (!student) 								return {status: 202, message: 'not students by group'};

  	for (var i = 0; i < student.length; i++) await model.createResult(student[i].student_id, req.body.test);
	
  	return {status: 200, message: 'ok'};
}

exports.createHomework = async function (req)
{	
	if(!req.body.group || !req.body.template) 	return {status: 418, message: 'no group or no template'};

  	let student = await model.getStudentIdByGroupId(req.body.group);

  	if (!student) 								return {status: 202, message: 'not students by group'};

  	for (var i = 0; i < student.length; i++) await model.createHomework(student[i].student_id, req.body.template);
	
  	return {status: 200, message: 'ok'};
}  

exports.getHomework = async function (req)
{	
	let homework = await model.getHomework(req.cookies['SAI']);

	if(homework.length > 0)		return { status: 200, result: homework };
	else						return { status: 202, message: 'not found' };
}  

exports.createHomeworkResult = async function (req)
{	
	if(!req.body.id || !req.body.score) 	return {status: 418, message: 'no id or no score'};

	let inserted = await model.createHomeworkResult(req.body.id, req.body.score);

	if(inserted)					return {status: 200, message: 'success'};
	else							return {status: 202, message: 'error'};
}  

exports.getTestResult = async function(req){
	if(!req.body.test_id) return {status: 418, message: 'no test_id'};

	if(!req.body.student_id) return {status: 418, message: 'no student_id'};

	let testInfo = await model.getTest(req.body.test_id);

	let testName = await model.getNameTest(req.body.test_id);

	let result 	 = await model.getResultTest(req.body.student_id, req.body.test_id);

	return {status: 200, testInfo, testName, result};
} 
