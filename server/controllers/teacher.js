let model = require('../models/teacher');
 
exports.Info = async function(index)
{
	try
	{
		if (!index) throw new Error('index is undefined');

		let rows = await model.Rows({index});
		if(rows.length > 0)
		{
			return {status: 200, body: rows[0]};
		}
		else
		{
			return {status: 202, message: 'not found'};
		}

	}
	catch (err)
	{
		return {status: 418, message: 'no index'};
	}
}
exports.Patch = async function(data, index)
{
	try
	{
		if (!index) throw new Error('index is undefined');

		if(!data.lastname || !data.phone || !data.login)
		{
			return {status: 418, message: 'Заполните все поля!'};
		}
		else
		{
			let updated = await model.Updated({index, login: data.login, lastname: data.lastname, phone: data.phone});
			if(updated[0].affectedRows>0)
			{
				return {status: 200, message: 'ok'};
			}
			else
			{
				return {status: 200, message: 'not found'};
			}
		}

	}
	catch (err)
	{
		return {status: 418, message: 'no index'};
	}
}
exports.PatchPass = async function(data, index)
{
	try
	{
		if (!index) throw new Error('index is undefined');

		if(!data.pass || !data.oldpass)
		{
			return {status: 418, message: 'fields error'};
		}
		else
		{
			let rowsPass = await model.RowsPass({index});
			if(rowsPass.length > 0)
			{
				if(rowsPass[0].pass == data.oldpass)
				{
					let updated = await model.UpdatedPass({index, pass: data.pass});
					if(updated[0].affectedRows> 0)
					{
						res.status(200).json({message: 'ok'});
					}
					else
					{	
						return {status: 202, message: 'Не удалось изменить пароль ('};
					}
				}
				else
				{
					return {status: 200, message: 'Неверный пароль!'};
				}
			}
			else
			{
				return {status: 200, message: 'not found'};
			}
		}

	}
	catch (err)
	{
		return {status: 418, message: 'no index'};
	}
}
























