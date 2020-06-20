let quizModel 		= require('../../apiModels/quiz'),
	qContentModel 	= require('../../apiModels/quizContent'),
	qResultModel 	= require('../../apiModels/quizResult'),
	groupModel		= require('../../apiModels/group'),
	studentModel	= require('../../apiModels/student')

exports.getQuiz = async (req) => {
	if(!req.body.quiz_id) return {status: 418, message: 'no quiz_id'}

	let quiz = await quizModel.getTeacherQuiz(req.body.myId, req.body.quiz_id)
	if(!quiz) return {status: 404}

	quiz.contents = await qContentModel.getContents(quiz.id)	

	return {status: 200, quiz}
}

exports.getQuizList = async (req) => {
	if(req.body.text) 	return {status: 200, quiz: await quizModel.find(req.body.myId, req.body.text)}
	else 				return {status: 200, quiz: await quizModel.getTeacherQuizList(req.body.myId)}
}

exports.getQuizResult = async (req) => {
	if(!req.body.result_id) return {status: 418, message: 'no result_id'}

	let result = await qResultModel.getTeacherResult(req.body.myId, req.body.result_id)
	if(!result) return {status: 404}

	return {status: 200, result}
}

exports.getQuizResultList = async (req) => {
	if(req.body.text) 	return {status: 200, results: await qResultModel.find(req.body.myId, req.body.text)}
	else 				return {status: 200, results: await qResultModel.getTeacherResultList(req.body.myId)}
}

exports.getStudentQuizResultList = async (req) => {
	if(!req.body.studentId) return { status: 418, message: 'no result_id'}
	let results = await qResultModel.findStudentResultList(req.body.myId, req.body.studentId)
	return {status: 200, results }
}

exports.findQuiz = async (req) => {
	if(!req.body.group_id) return {status: 418, message: 'no group_id'}

	let group = await groupModel.getGroup(req.body.group_id)
	if(!group) return {status: 202, message: 'no such group'}

	let students = await studentModel.findGroup(group.group_id)
	if(!students.length) return {status: 202, message: 'no students'}

	let student = students[0]
		
	let quiz = await quizModel.findQuiz(req.body.myId, student.lvl, req.body.group_id)
	if(!quiz.length) return {status: 202, message: 'no quiz'} 

	return {status: 200, quiz}
}

exports.deleteQuiz = async (req) => {
	if(!req.body.quiz_id) return {status: 418, message: 'no quiz_id'}

	let quiz = await quizModel.getTeacherQuiz(req.body.myId, req.body.quiz_id)
	if(!quiz) return {status: 404}	

	let oldContents = await qContentModel.getContents(req.body.quiz_id)
	
	for(i=0; i<oldContents.length; i++) {
		let deleted = await qContentModel.delete(oldContents[i].id)
		if(!deleted) throw new Error('Can\'t delete old content -> qContentModel.delete')
	}

	let quizDeleted = await quizModel.deleteQuiz(req.body.quiz_id)
	if(!quizDeleted) throw new Error('Can\'t delete quiz -> quizModel.deleteQuiz')

	return {status: 200}
}

exports.addQuiz = async (req) => {
	if(!req.body.name) 		return { status: 418, message: 'no name' }
	if(!req.body.level) 	return { status: 418, message: 'no level' }
	if(!req.body.contents)	return { status: 418, message: 'no contents' }

	let contents
	try {
		contents = JSON.parse(req.body.contents)
	} catch(err) {
		return {status: 418, message: 'invalid content format'}	
	}

	if(!await checkContents(contents)) return {status: 418, message: 'use standart to make contents'}
	let quizId = await quizModel.add(req.body.myId, req.body.level, req.body.name)
	if(!quizId) throw new Error('Can\'t add quiz -> quizModel.add')
	for(i=0; i<contents.length; i++) {
		let con = [2,3,4,5].includes(contents[i].type)? JSON.stringify(contents[i].content):contents[i].content
		let contentId = await qContentModel.add(quizId, contents[i].type, con, contents[i].position)
		if(!contentId) throw new Error('Can\'t add qContent -> qContentModel.add') 
	}

	return { status: 200 }
}

exports.updateQuiz = async (req) => {
	if(!req.body.quiz_id) 	return { status: 418, message: 'no quiz_id' }
	if(!req.body.contents) 	return { status: 418, message: 'no contents' }
	if(!req.body.name) 		return { status: 418, message: 'no name' }
	if(!req.body.level) 	return { status: 418, message: 'no level' }


	let contents
	try {
		contents = JSON.parse(req.body.contents)
	} catch(err) {
		return {status: 418, message: 'invalid content format'}	
	}

	if(!await checkContents(contents)) return {status: 418, message: 'use standart to make contents'}

	let quiz = await quizModel.getTeacherQuiz(req.body.myId, req.body.quiz_id)
	if(!quiz) return { status: 404, message: 'no such quiz' }

	
	let updated = await quizModel.updateQuiz(req.body.quiz_id, req.body.name, req.body.level)
	if(!updated) throw new Error('Can\'t updated quiz -> quizModel.updateQuiz')


	let oldContents = await qContentModel.getContents(req.body.quiz_id)
	for(i=0; i<oldContents.length; i++) {
		let deleted = await qContentModel.delete(oldContents[i].id)
		if(!deleted) throw new Error('Can\'t delete old content -> qContentModel.delete')
	}

	for(i=0; i<contents.length; i++) {
		let con = [2,3,4,5].includes(contents[i].type)? JSON.stringify(contents[i].content):contents[i].content
		let contentId = await qContentModel.add(req.body.quiz_id, contents[i].type, con, contents[i].position)
		if(!contentId) throw new Error('Can\'t add qContent -> qContentModel.add') 
	}

	return { status: 200 }
}

exports.checkQuiz = async (req) => {
	if(!req.body.result_id) return { status: 418, message: 'no result_id' }
	if(!req.body.contents) 	return { status: 418, message: 'no contents' }

	let contents
	try {
		contents = JSON.parse(req.body.contents)
		if(typeof contents != "object") throw new Error()

	} catch(err) {
		return {status: 418, message: 'invalid content format'}
	} 

	let result = await qResultModel.getTeacherResult(req.body.myId, req.body.result_id) 
	if(!result) return {status: 202, message: 'no result'}



	let count = 0, 
		sum = 0

	for(let i=0; i<contents.length; i++) {
		if(!contents[i].type) 		{
			return {status: 418, message: 'no contents.type'}
		}
		else {
			if (contents[i].type == 2 || contents[i].type > 5) {
				if (!contents[i].value && contents[i].value != 0) return {status: 418, message: `no contents.value : {type: ${contents[i].type}, index: ${i}}`}
				else {
					count++
					sum += contents[i].value
				}
			}
		}
	}

	let score = sum/count

	let updated = await qResultModel.sendResult(req.body.result_id, req.body.contents, score)
	if(!updated) throw new Error('Can\'t updated quizResult -> qResultModel.sendResult')

	return { status: 200 }
}


exports.sendQuiz = async (req) => {
	if(!req.body.group_id)	return { status: 418, message: 'no group_id' }
	if(!req.body.quiz_id) 	return { status: 418, message: 'no quiz_id' }

	let students = await studentModel.findGroup(req.body.group_id)

	let quiz = await quizModel.getTeacherQuiz(req.body.myId, req.body.quiz_id)
	if(!quiz) return { status: 404, message: 'no such quiz' }

	for(i=0; i<students.length; i++) 
		await qResultModel.add(req.body.quiz_id, students[i].student_id)

	return { status: 200 }
}

async function checkContents(contents, stage) {
	for(i=0; i<contents.length; i++) {		
		let content = contents[i]
		if(!content.type) return false

		switch(Number(content.type)) {
			case 1:
				if(!content.content) return false
				break		
			case 2: 
				if(!content.content) 						return false
				if(!content.content.question) 				return false
				if(content.content.correct == undefined) 	return false
				if(!content.content.answers) 				return false
				break
			case 3:
				if(!content.content) 			return false
				if(!content.content.length) 	return false
				break
			case 4: 
				if(!content.content) 			return false
				if(!content.content.length) 	return false
				for(j=0; j<content.content.length; j++) {
					if(!content.content[j].file) return false
					if(!content.content[j].type) return false
					if(!(content.content[j].type == 2 || content.content[j].type == 1)) 
						return false
				}
				break
			case 5:
				if(!content.content) 							return false
				if(!content.content.length) 					return false
				for(j=0; j<content.content.length; j++) {
					if(!content.content[j].name) 				return false
					if(!content.content[j].file) 				return false
					if(content.content[j].size == undefined)	return false
				}
				break
		}
	}
	return true
}