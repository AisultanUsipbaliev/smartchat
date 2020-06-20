let qContentModel 		= require('../../apiModels/quizContent'),
	quizModel 			= require('../../apiModels/quiz'),
	quizResultModel 	= require('../../apiModels/quizResult'),
	implementationModel = require('../../apiModels/implementation'),
	studentModel 		= require('../../apiModels/student')

exports.getQuizList = async (req) => {
	let quizList = await quizModel.getStudentQuizList(req.body.myId)
	return quizList.length? { status: 200, quizList } : { status: 202, message: 'empty'}	
}

exports.getQuiz = async (req) => {
	if(!req.body.quizId) { return { status: 418, message: 'no quizId' } }

	let quiz = await quizModel.getStudentQuiz(req.body.myId, req.body.quizId)
	if(!quiz) return {status: 403, message: 'no such quiz'}

	quiz.contents = await qContentModel.getContents(quiz.id)
	return {status: 200, quiz}
}

exports.sendQuiz = async function(req) {
	if(!req.body.quizId) 	return {status: 418, message: 'no quizId'}
	if(!req.body.contents) 	return {status: 418, message: 'no contents'}

	let quiz = await quizModel.getStudentQuiz(req.body.myId, req.body.quizId)
	if(!quiz) return {status: 403, message: 'no such quiz'}

	let contents
	try {
		contents = JSON.parse(req.body.contents)
		if(typeof contents != "object") throw new Error()
	} catch(err) {
		return {status: 418, message: 'invalid content format'}
	}

	let flag = true
	let count = 0,
		sum = 0

	for (let i = 0; i < contents.length; i++) {
		if(contents[i].type == 2) {
			
			if (contents[i].content.correct == contents[i].content.answer) contents[i].value = 10
			else contents[i].value = 0

			sum += contents[i].value
			count++
		
		}
		else if(contents[i].type > 5) flag = false
	}

	let updated = await quizResultModel.updateQuizResult(quiz.resultId, JSON.stringify(contents))
	
	if (flag && contents.length) {
		let score = sum/count
		if(score == 0) score = 0.1
		let setQuizResult = await quizResultModel.sendResult(quiz.resultId, JSON.stringify(contents), score)
		if(!setQuizResult) throw new Error('Can\'t updated quizResult -> quizResultModel.sendResult')
	}

	if (updated) {
		let implementation = await implementationModel.get(5)
		if (!implementation) sayMe('apiStudent/controllers/quiz.js', {}, 'implementation not found')
		else {
			let setScore = await studentModel.updateScore(req.body.myId, implementation.value)
			if (!setScore) sayMe('apiStudent/controllers/quiz.js', {}, 'Can\'t set score -> studentModel.updateScore')
		}
		return {status: 200}
	} else return {status: 202} 
} 

exports.getQuizResult = async (req) => {
	if(!req.body.quizId) { return { status: 400, message: 'quizId is not defined' } }

	let result = await quizResultModel.getStudentResult(req.body.myId, req.body.quizId)
	if(!result) return {status: 403, message: 'no such result'}
		
	return {status: 200, result}
}