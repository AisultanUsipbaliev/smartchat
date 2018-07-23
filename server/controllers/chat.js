let model = require('../model/chat');
let groupModel = require('../model/group');
exports.Get = async function(data, id)
{
	try
	{
		if(!data.group) throw new Error('group is undefined');

		let selected = await model.getChat(data.group);
		if (selected.length) 
		{
			await model.readChat(data.group, id);
			return {status: 200, body: selected}
		} 
		else 
		{
			return {status: 202, message: 'empty'}
		}
	}
	catch(err)
	{
		return {status: 418, message: err};
	}
}
exports.GetChats = async function(id)
{
	let selected = await groupModel.getGroupsByTeacher(id);
	if (selected.length>0) 
	{
		return {status: 200, body: selected}
	} 
	else 
	{
		return {status: 202, message: 'not found!'}
	}
}

exports.GetMiss = async function(id)
{
	let result = await model.getMissedChats(id);
	return { status: 200, body: result }
}