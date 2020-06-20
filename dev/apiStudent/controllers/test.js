let testModel 		= require('../../apiModels/test')
let questionModel 	= require('../../apiModels/question')

exports.getTests = async function(req) {
	let tests = await testModel.getStudentTests(req.body.myId)
	return tests.length? {status: 200, tests}:{status: 202}
}

exports.getTest = async function(req) {
	if(!req.body.test_id) return {status: 418, message: 'no test_id'}

	let test = await testModel.getStudentTest(req.body.myId, req.body.test_id)
	if(!test) return {status: 404}
		
	let questions = await questionModel.getQuestions(test.test_id)
	for(let i = 0; i< questions.length; i++) delete questions[i].correct

	return {status: 200, test, questions}
}