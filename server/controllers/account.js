let teacherModel = require('../model/teacher');

exports.Login = async function(data)
{
	try
	{
		if(!data.email) throw new Error('Email is undefined');
		if(!data.pass) throw new Error('Pass is undefined');

		let result = await teacherModel.checkPassword(data.email, data.pass);
		if(result)
		{
			return {status: 200, body: result}
		}
		else
		{
			return {status: 202, message: 'Wrong pass or login'}
		}
	}
	catch(err)
	{
		return {status: 418, message: err}
	}
}
exports.Registrate = async function(data) 
{
	try
	{
		if(!data.login) throw new Error('Login is undefined');
		if(!data.lastname) throw new Error('Lastname is undefined');
		if(!data.phone) throw new Error('Phone is undefined');
		if(!data.pass) throw new Error('Pass is undefined');
		if(!data.email) throw new Error('Email is undefined');

		let insert = await teacherModel.createTeacher(data);

		if(insert.affectedRows>0)
		{
			let result = await teacherModel.getTeacherByEmail(data.email);
			return {status: 200, body: result}
		}
		else
		{
			return {status: 202, message: 'can\'t insert'};
		}
	}
	catch(err)
	{
		return {status: 418, message: err};
	}
}
exports.Check = async function(data)
{
	try 
	{
		if(!data.email) throw new Error('Логин нужен!');
		
		let select = await teacherModel.getTeacherByEmail(data.email);

		if (select) 
		{
			return {status: 202, message: 'Пользователь с таким Email уже существует!'}
		} 
		else 
		{
			return {status: 200, message: 'Хороший email!'}
		}
	}
	catch (err)
	{
		return {status: 418, message: err}
	}	
}


