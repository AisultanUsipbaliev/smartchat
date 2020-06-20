let resultModel = require('../../apiModels/result'),
	questionModel = require('../../apiModels/question'),
	testModel = require('../../apiModels/test')

exports.getResult = async (req) => {
	if(!req.body.result_id) return {status: 418, message: 'no result_id'}

	let result = await resultModel.getResult(req.body.result_id)
	if(!result) return { status: 404, message: 'result not found' }

	let test = await testModel.getTest(result.test_id)
	if(!test) return { status: 404, message: 'test not found' }
	
	if(test.teacher_id != req.body.myId) return {status: 404, message: 'data not found'}
	
	test.question = await questionModel.getQuestions(test.test_id)
	if(!test.question.length) return { status: 404, message: 'question not found' }

	await resultModel.setIsreadResult(req.body.result_id)

	let unreadTestResult = await resultModel.getUnreadResultCount(req.body.myId)

	return {status: 200, test, result, unreadTestResult }
} 

exports.getResultList = async (req) => {
	if (req.body.text) {
		let resultF = await resultModel.findResults(req.body.myId, req.body.text)
		if(!resultF.length) return { status: 202, message: 'resultF not found' }
	    return { status: 200, result: resultF }
	} else {
		let resultG = await resultModel.getResults(req.body.myId)
		if(!resultG.length) return { status: 202, message: 'resultG not found' }
	    return { status: 200, result: resultG }
	}	
}

exports.getStudentResultList = async (req) => {

	if (!req.body.studentId) return { status: 418, message: 'no studentId' }

	let result = await resultModel.findStudentResults(req.body.myId, req.body.studentId)

	return { status: 200, result }
}