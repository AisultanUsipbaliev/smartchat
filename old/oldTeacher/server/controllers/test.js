let model = require('../models/test');

exports.getTest = async function (req)
{	
	if (!req.body.test_id) 
	{
		let tests = await model.getTestsByTeacherId(req.cookies['SAI']);

		if(tests.length > 0) 							return {status: 200, body: tests};
		else											return {status: 200, message: 'empty'}
	} 
	else 
	{
		let test = await model.getTestByTestId(req.body.test_id);
		let questions = await model.getQuestionsByTestId(req.body.test_id);

		if(test)										return {status: 200, body: test, quest: questions};
		else											return {status: 202, message: 'empty'};
	}
}

exports.createOrUpdateTest = async function (req)
{	
	if(!req.body.name || !req.body.lvl || !req.body.mas) return {status: 418, message: 'no name, lvl or mas'};

	let test_id;

	if(req.body.test_id != 0)
	{
		test_id = req.body.test_id;
		 
		await model.deleteQuestionByTestId(test_id);
		await model.updateTest(req.body.name, req.cookies['SAI'], req.body.lvl, test_id);
	}
	else 
	{
		let teacherInfo = await model.getTeacher(req.cookies.SAI);
		let levelInfo 	= await model.getLevel(req.body.lvl);
		await writeAction(`Преподаватель ${teacherInfo.email} создал(-а) тест ${req.body.name} - уровень ${levelInfo.lvl_name}`);
		test_id = await model.createTest(req.body.name, req.cookies['SAI'] , req.body.lvl)
	}
	
	if(test_id)
	{
		let mas = req.body.mas.split(',');
		let quest_title = null;
		let quest_weight = null;
		let ms = [];
		let correct = null;

		for(let i = 0; i<mas.length; i++)
		{
			if(quest_title == null) quest_title = mas[i];
			else
			{
				if(quest_weight == null) quest_weight = mas[i];
				else
				{
					if(mas[i]!='%%') ms.push(mas[i]);
					else
					{
						let answers = '';

						for(let j = 0; j<ms.length-1; j++) answers += ms[j] + '%%';
			
						let correct = ms[ms.length-1];

						await model.createQuestion(test_id, quest_title, answers, correct, quest_weight );

						quest_title = null;
						quest_weight = null;
						correct = null;
						answers = null;
						ms = [];
					}
				}
			}
		}
							return {status: 200, message: 'ok'}
	}
	else 					return {status: 202, message: 'troubles with creating a test'}
}

exports.deleteTest = async function (req)
{	
	if(!req.body.test_id) 	return {status: 418, message: 'no test_id'};
		
	let deleted = await model.deleteTest(req.body.test_id);

	if(deleted) 			return {status: 200, message: 'ok'};
	else 					return {status: 202, message: 'not found'};
}
