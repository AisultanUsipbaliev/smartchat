let testModel = require('../../apiModels/test'),
	questionModel = require('../../apiModels/question'),
	groupModel = require('../../apiModels/group'),
	studentModel = require('../../apiModels/student'),
	levelModel = require('../../apiModels/level'),
	resultModel = require('../../apiModels/result')

exports.getTest = async function (req) {	
	if(!req.body.test_id) return {status: 418, message: 'no test_id'}
	
	let test = await testModel.getTeacherTest(req.body.myId, req.body.test_id)
	if(!test) return {status: 404, message: 'test not found'}

	test.questions = await questionModel.getQuestions(req.body.test_id)
	return {status: 200, test}
}

exports.getTestList = async (req) => {	 
	if (req.body.text) {
		let testF = await testModel.findMyTests(req.body.myId, req.body.text)
		return testF.length ? { status: 200, tests: testF } : {status: 202, message: 'empty tests'}
	} else {
		let testG = await testModel.getTeacherTests(req.body.myId)
		return testG.length ? { status: 200, tests: testG } : {status: 202, message: 'empty tests'}
	}
}

exports.findTest = async (req) => {
	if (!req.body.group_id) return {status: 418, message: 'no group_id'}

	let group = await groupModel.getGroup(req.body.group_id)
	if(!group) return {status: 404, message: 'no such group'}

	let students = await studentModel.findGroup(group.group_id)
	if(!students.length) return {status: 404, message: 'no students'}

	let student = students[0]
		
	let test = await testModel.findTest(req.body.myId, student.lvl, req.body.group_id)
	if(!test.length) return {status: 202, message: 'no test'} 

	return {status: 200, test}
}

exports.addTest = async (req) => {	
	if(!req.body.name) 		return {status: 418, message: 'no name' }
	if(!req.body.lvl) 		return {status: 418, message: 'no lvl' }
	if(!req.body.questions)	return {status: 418, message: 'no questions'}

	let questions = []

	try {
		questions = JSON.parse(req.body.questions);
	} catch(err) {
		return {status: 418, message: 'incorrect json format at field questions'}
	}
	
	for(i=0; i<questions.length; i++) {
		if(!questions[i].correct) 			return {status: 418, message: 'no correct'}
		if(!questions[i].weight) 			return {status: 418, message: 'no weight'}
		if(!questions[i].quest_title) 		return {status: 418, message: 'no title'}
		if(!questions[i].variants) 			return {status: 418, message: 'no variants'}
		if(!questions[i].variants.length) 	return {status: 418, message: 'variants are empty'}
		questions[i].answers = []	
		for (let j = 0; j < questions[i].variants.length; j++) {
			questions[i].answers.push(questions[i].variants[j].content);
		}
	}

	let level = await levelModel.getLevel(req.body.lvl)
	if(!level) return {status: 404, message: 'level not found'}

	let testId = await testModel.createTest(req.body.name, req.body.myId, req.body.lvl)
	if(!testId) throw new Error('Can\'t add test -> testModel.createTest')

	let created = await createQuestion(testId, questions)
	if(!created) throw new Error('Can\'t add question -> createQuestion')

	// writeAction(`Преподаватель ${req.body.myName} создал(-а) тест ${req.body.name} - уровень ${level.lvl_name}`)
	return { status: 200 }	
}

exports.updateTest = async (req) => {	
	if(!req.body.test_id) 	return { status: 418, message: 'no test_id' }
	if(!req.body.name) 		return { status: 418, message: 'no name' }
	if(!req.body.lvl) 		return { status: 418, message: 'no lvl' }
	if(!req.body.questions)	return {status: 418, message: 'no questions'}

	let questions = []

	try {
		questions = JSON.parse(req.body.questions);
	} catch(err) {
		return {status: 418, message: 'incorrect json format at field questions'}
	}
	
	for(i=0; i<questions.length; i++) {
		if(!questions[i].correct) 			return {status: 418, message: 'no correct'}
		if(!questions[i].weight) 			return {status: 418, message: 'no weight'}
		if(!questions[i].quest_title) 		return {status: 418, message: 'no title'}
		if(!questions[i].variants) 			return {status: 418, message: 'no variants'}
		if(!questions[i].variants.length) 	return {status: 418, message: 'variants are empty'}
		questions[i].answers = []
		for (let j = 0; j < questions[i].variants.length; j++) {
			questions[i].answers.push(questions[i].variants[j].content);
		}
	}

	let test = await testModel.getTeacherTest(req.body.myId, req.body.test_id)
	if(!test) return {status: 404, message: 'test not found'}

	let level = await levelModel.getLevel(req.body.lvl)
	if(!level) return {status: 404, message: 'level not found'}

	let deleted = await questionModel.deleteQuestions(req.body.test_id)
	// if(!deleted) throw new Error('Can\'t deleted question -> questionModel.deleteQuestions')

	let updated = await testModel.updateTest(req.body.name, req.body.myId, req.body.lvl, req.body.test_id)
	if(!updated) throw new Error('Can\'t updated test -> testModel.updateTest')

	let created = await createQuestion(req.body.test_id, questions)
	if(!created) throw new Error('Can\'t add question -> questionModel.createQuestion')

	return { status: 200 }
}

exports.deleteTest = async (req) => {	
	if(!req.body.test_id) 	return { status: 418, message: 'no test_id' }

	let test = await testModel.getTeacherTest(req.body.myId, req.body.test_id)
	if(!test) return { status: 404, message: 'test not found'}
	
	let deleted = await testModel.deleteTest(test.test_id)
	if (!deleted) throw new Error('Can\'t deleted test -> testModel.deleteTest')

	return { status: 200 }
}

exports.sendTest = async (req) => {
	if(!req.body.group_id)	return { status: 418, message: 'no group_id' }
	if(!req.body.test_id) 	return { status: 418, message: 'no test_id' }

	let students = await studentModel.findGroup(req.body.group_id)

	let test = await testModel.getTeacherTest(req.body.myId, req.body.test_id)
	if(!test) return { status: 404, message: 'no such test' }

	for(i=0; i<students.length; i++) await resultModel.add(req.body.test_id, students[i].student_id)

	return { status: 200 }
}

async function createQuestion(testId, q) {
	for (i=0; i<q.length; i++) {
		let created = await questionModel.createQuestion(testId, q[i].quest_title, JSON.stringify(q[i].answers), q[i].correct, q[i].weight )
		if(!created) return false
	}
	return true
}  