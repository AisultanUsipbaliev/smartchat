let model = require('../models/test');

exports.Get = async function(data, index)
{
	if (data.test_id) 
	{
		let selected = await model.SelectedS({index})
		if(selected.length>0)
		{
			return {status: 200, body: selected};
		}
		else
		{
			return {status: 202, message: 'empty'};
		}
	} 
	else 
	{
		let selected = await model.SelectedD({test_id: data.test_id});
		let questions = await model.Questions({test_id: data.test_id});

		if(selected.length > 0)
		{
			return {status: 200, body: selected, quest: questions}
		}
		else
		{
			return {status: 202, message: 'empty'}
		}
	}
} 
exports.Post = async function(data, index)
{
	try 
	{
		if(!data.name || !data.lvl || !data.mas) throw new Error('no name, lvl or mas');

		let test_id;

		if(data.test_id != 0)
		{
			test_id = data.test_id;
			let deleted = await model.DeleteQuestion({test_id: data.test_id})
		}
		else
		{
			let create_test = await model.CreateTest({index, name: data.name, lvl: data.lvl})
			test_id = create_test.insertId;
		}
		
		if(test_id)
		{
			let mas = data.mas.split(',');

			let quest_title = null;
			let quest_weight = null;
			let ms = [];
			let correct = null;

			for(let i = 0; i<mas.length; i++)
			{

				if(quest_title == null)
				{
					quest_title = mas[i];
				}
				else
				{
					if(quest_weight == null)
					{
						quest_weight = mas[i];
					}
					else
					{
						if(mas[i]!='%%') ms.push(mas[i]);
						else
						{
							let answers = '';
							for(let j = 0; j<ms.length-1; j++)
							{
								answers += ms[j] + '%%';
							}
							let correct = ms[ms.length-1];

							let create_quest = await CreateQuestion({test_id, quest_title, answers, correct, quest_weight});

							quest_title = null;
							quest_weight = null;
							correct = null;
							answers = null;
							ms = [];
						}
					}
				}
			}

			return {status: 200, message: 'ok'};

		}
		else
		{
			return {status: 202, message: "troubles with creating a test"};
		}

	}
	catch (err)
	{
		return {status: 418, message: err};
	}
}
exports.Delete = async function(data)
{
	try 
	{
		if (!data.test_id) throw new Error('no test_id');

		let deleted = await model.DeleteTest({test_id: data.test_id});

		if(deleted.affectedRows>0)
		{
			return {status: 200, message: 'ok'};
		}
		else
		{
			return {status: 202, message: 'not found'};
		}

	}
	catch (err)
	{
		return {status: 418, message: err}
	}
}





 