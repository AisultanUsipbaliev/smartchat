let model = require('../models/test');

exports.getTests = async function(req) {
	let info = await model.getTests(req.body.myId);
	if(info.length > 0) return {status: 200, data: info};
	else 				return {status: 202, message: 'empty'};
}

exports.getTest = async function(req) {
	let haveTest = await model.getMyTest(req.body.myId, req.body.test_id);
	if(!haveTest) return {status: 404}
		
	if(!req.body.test_id) return {status: 418, message: 'no test_id'};
	let data = await model.getTest(req.body.test_id);

	for(let i = 0; i< data.length; i++) delete data[i].correct;
	
	let name = await model.getNameTest(req.body.test_id);
	if(data.length > 0) return {status: 200, data, name};
	else 				return {status: 202, message: 'empty'};
} 

exports.checkResult = async function(req) {
	if (!req.body.test_id) 	return {status:418, message: 'no test_id'}
	if (!req.body.result) 	return {status:418, message: 'no result'}

	let answers = JSON.parse(req.body.result);

	let test = await model.getTest(req.body.test_id);
	let correct = 0;
	let weight = 0;
	for (var i = 0; i < test.length; i++) {
		weight += test[i].weight;
		if(test[i].correct == answers[i].correct) correct += test[i].weight;
	}

	let result = (correct * 100) / weight;
	let count = await model.updateResult(req.body.myId, req.body.test_id, result, req.body.result)

	if(count) return {status:200, result}
	else return {status:402, message: 'updateResult error'}
}

exports.check = async function(req) {
	if (!req.body.test_id)  return {statust: 418, message: 'no test_id'}

	let result = await model.getCorrectAndAnswer(req.body.myId, req.body.test_id)

	if (result.length>0) 	return {status: 200, result}
	else 					return {status: 202, message: 'empty'};
	
}


exports.getResult = async function(req) {
	if(!req.body.test_id) return {status: 418, message: 'no test_id'};

	let testInfo = await model.getTest(req.body.test_id);
	let testName = await model.getNameTest(req.body.test_id);
	let result 	 = await model.getResult(req.body.myId, req.body.test_id);

	return {status: 200, testInfo, testName, result};
}

exports.getLevelTest = async function(req) {
	let index = 0;
	if (req.body.index) index = req.body.index;
	let testList = await model.getLevelTest(index); 
		 
	if (testList.length > 0) 	return {status: 200, message: 'success', testList}
	else 						return {status: 402, message: 'empty'}

}


exports.checkLevelTest = async function(req) {
	let index = 0;
	if (req.body.index) index = req.body.index;

	if (!req.body.answers)  return {status: 418, message: 'no answers'};

	let answers = JSON.parse(req.body.answers);

	let rightAnswers =  await model.getLevelTestAnswers(index);

	if (rightAnswers.length != answers.length) return {status: 202, message: 418, message: 'not correct answers length'};
		
	let cnt = 0;

	for (let i = 0; i < answers.length; i++) 
		for(let j = 0; j < rightAnswers.length; j++)
			if(answers[i].id == rightAnswers[j].id && answers[i].correct == rightAnswers[i].correct)
				cnt++;

	let level = null;

	if	(cnt < 6) 
	{
		if (index == 0) level = 1;
		else if (index == 10) level = 2;
		else if (index == 20) level = 3;
		else if (index == 30) level = 4;
		else if (index == 40) level = 5;

		let result = await model.updateLevel(req.body.myId, level);
		if(result)
		{
			let lvl_name = await model.getLevelName(level);
			index = parseInt(index);
			index = index+10;
			return {status: 200, lvl_name: lvl_name, index: index, rightAnswer: cnt, next: false};
		}
		else return {status: 402, message: 'levelUpdate error'}
	}		
	else 
	{
		if (index == 40) 
		{
			level = 6;

			let result = await model.updateLevel(req.body.myId, level);
			if(result)
			{
				let lvl_name = await model.getLevelName(level);
				index = parseInt(index);
				index = index+10;		
				return {status: 200, lvl_name: lvl_name, index: index, rightAnswer: cnt, next: false};
			}
			else return {status: 402, message: 'levelUpdate error'}
		} 
		else 
		{
			index = parseInt(index);
			index = index+10;
			return {status: 200, next: true, index: index, rightAnswer: cnt}
		}
	}	
}