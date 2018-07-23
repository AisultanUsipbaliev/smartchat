let model = require('../models/group');

exports.Get = async function(data, index)
{
	if (!data.group_id) 
	{
		let groups = await model.Groups({index});

		if(groups.length>0)
		{
			return {status: 200, groups: groups}
		}
		else
		{
			return {status: 202, message: 'not found 111'};
		}
	} 
	else 
	{
		let students = await model.Students({group_id: data.group_id});

		if(students.length > 0)
		{
			return {status: 200, students: students}
		}
		else
		{
			return {status: 200, message: 'not found fgdgdgs'};
		}
	}
}
exports.Post = async function(data)
{
	let group = await model.Group({name: data.name, id: data.id});

	if(group.affectedRows>0)
	{
		return {status: 200, message: 'success'};
	}
	else
	{
		console.log({status: 500, message: 'group not updated'})
		return {status: 500, message: 'group not updated'};
	}
}
exports.Delete = async function(data)
{
	let delGr = await model.DelGroup({id: data.id});

	if(group.affectedRows>0)
	{
		return {status: 200, message: 'success'};
	}
	else
	{
		console.log({status: 500, message: 'group not deleted'})
		return {status: 500, message: 'group not deleted'};
	}
}

 


















