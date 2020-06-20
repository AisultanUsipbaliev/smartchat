let testModel 		= require('../../apiModels/test'),
	resultModel		= require('../../apiModels/result'),
	questionModel 	= require('../../apiModels/question'),
	implementationModel = require('../../apiModels/implementation'),
	studentModel 		= require('../../apiModels/student')

exports.checkTest = async function(req) {
	if (!req.body.test_id) 	return {status:418, message: 'no test_id'}
	if (!req.body.result) 	return {status:418, message: 'no result'}

	let test = await testModel.getTest(req.body.test_id)
	if(!test) return {status: 404, message: 'no such test'}

	let result = await resultModel.getStudentResult(req.body.myId, req.body.test_id)
	if(!result) return {status: 404, message: 'no such result'}

	let answers = JSON.parse(req.body.result)
	let questions = await questionModel.getQuestions(req.body.test_id)

	let correct = 0;
	let weight = 0;

	for (var i = 0; i < answers.length; i++) {
		weight += questions[i].weight
		if(questions[i].correct == answers[i].correct) correct += questions[i].weight
	}

	let computed = (correct * 100) / weight;
	let res = await resultModel.addResult(req.body.myId, req.body.test_id, computed, req.body.result)
	if(!res) throw new Error('Can\'t add result')
	
	let implementation = await implementationModel.get(4)
	if (!implementation) sayMe('apiStudent/controllers/result.js', {}, 'implementation not found')
	else {
		let setScore = await studentModel.updateScore(req.body.myId, implementation.value)
		if (!setScore) sayMe('apiStudent/controllers/result.js', {}, 'Can\'t set score -> studentModel.updateScore')
	}

	return {status:200, computed}
}

exports.getMyResult = async function(req) {
	if(!req.body.test_id) 	return {status:418, message: 'no test_id'}

	let test = await testModel.getTest(req.body.test_id)
	if(!test) return {status: 404, message: 'no such test'}

	let result = await resultModel.getStudentResult(req.body.myId, req.body.test_id)
	if(!result) 			return {status: 404, message: 'no such result'}
	if(result.done == 0) 	return {status: 403}

	let questions = await questionModel.getQuestions(req.body.test_id)
	let answers = JSON.parse(result.answers)

	let computed = []

	for(let i=0; i<answers.length; i++) {
		
		for(let j=0; j<questions.length; j++) {
			let answer 		= answers[i]
			let question 	= questions[j]
			
			if(answer.quest_id == question.quest_id) {
				computed.push({
					id 			: question.quest_id,
					question 	: question.quest_title,
					variants 	: question.variants,
					correct 	: question.correct,
					answered	: answer.correct,
					success 	: question.correct == answer.correct
				})
			}
		}
	
	}

	return {status: 200, test, result, computed}
}