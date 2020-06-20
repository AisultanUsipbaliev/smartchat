let model = require('../models/template');

exports.get = async function(req)
{
	if(!req.body.rate_id) 		return {status: 418, message: 'no rate_id'};
	if(!req.body.lesson) 	return {status: 418, message: 'no lesson'};
	if(!req.body.lvl_id) 		return {status: 418, message: 'no lvl_id'}

	let access = await model.getAccess(req.cookies.SAI);
	let templates = await model.getTemplates(req.body.rate_id, req.body.lesson, req.body.lvl_id);

	if (templates.length>0)
	{
		let template = [];
		for (let i=0; i<templates.length; i++) 
		{
			let content = await model.getContent(templates[i].temp_id);

			template.push({
				order: 		templates[i].order,
				temp_id: 	templates[i].temp_id,
				dz: 		templates[i].dz, 
				content});
		}
		return {status: 200, template, access};
	} 
	else return {status: 202, message: 'empty', access};
}


exports.getTemplates = async function(req)
{
	if(!req.body.group_id) return {status: 418, message: 'no group_id'};

	let templates = await model.getGroupTemplates(req.body.group_id);

	if(templates.length > 0)
	{
		let mas = [];
		for(let i = 0; i<templates.length; i++)
		{
			let contents = await model.getTemplateContents(templates[i].temp_id);
			mas.push(contents);
		}
		let used = await model.getUsed(req.cookies.SAI, req.body.group_id);
		return { status: 200, body: mas, used };
	}
	else return {status: 202, message: 'empty'};
}

exports.reverse = async function(req)
{
	if(!req.body.first) 	return {status: 418, message: 'no first'};
	if(!req.body.second) 	return {status: 418, message: 'no second'};

	let access = await model.getAccess(req.cookies.SAI);
	if(!access) return {status: 403, message: 'access denied'};

	let firstinfo 	= await model.getTemplate(req.body.first);
	let secondinfo 	= await model.getTemplate(req.body.second);

	await model.changeOrder(secondinfo.temp_id, firstinfo.order);
	await model.changeOrder(firstinfo.temp_id, secondinfo.order);
	return {status: 200};
}

exports.useTemplate = async function(req)
{
	if(!req.body.temp_id) 	return {status: 418, message: 'no temp_id'};
	if(!req.body.group_id)	return {status: 418, message: 'no group_id'};

	let res = await model.useTemplate(req.body.temp_id, req.cookies.SAI, req.body.group_id);
	if(res) return {status: 200, message: 'success'};
	else	return {status: 202, message: 'invalid insert'};
}

exports.getPath = async function(req)
{
	let rates 	= await model.getRates();
	let levels	= await model.getLevels();

	if(rates.length == 0) 	return {status: 202, message: 'empty rates'};
	if(levels.length == 0)	return {status: 202, message: 'empty leveles'};

	let mas = [];

	for(let i = 0; i < rates.length; i++)
	{
		let object = {
			rate_id: 	rates[i].rate_id,
			rate_name: 	rates[i].rate_name,
			level: 		[]
		};

		for(let j = 0; j < levels.length; j++)
		{
			let ll = {
				lvl_id: 	levels[j].lvl_id,
				lvl_name: 	levels[j].lvl_name,
				lessons: 	rates[i].lessons
			}
			object.level.push(ll);
		}
		mas.push(object);
	}

	if(mas.length > 0) 	return {status: 200, mas};
	else 				return {status: 202, message: 'empty'};
}


exports.createTemplate = async function(req)
{
	if(!req.body.data) 			return {status: 418, message: 'no data'};
	if(!req.body.rate_id)		return {status: 418, message: 'no rate_id'};
	if(!req.body.lesson)	return {status: 418, message: 'no lesson'};
	if(!req.body.lvl_id)		return {status: 418, message: 'no lvl_id'};
	if(!req.body.dz) 			return {status: 418, message: 'no dz'};
	
	let access = await model.getAccess(req.cookies.SAI);
	if(!access) return {status: 403, message: 'access denied'};

	let data = JSON.parse(req.body.data);

	let id = await model.createTemplate(req.cookies.SAI, req.body.rate_id, req.body.lvl_id, req.body.lesson, req.body.dz);
	await model.changeOrder(id,id);

	if(id) for(let i = 0; i < data.length; i++) await model.addContent(id, data[i].type, data[i].content);
	else return {status: 202, message: 'invalid insert'};

	let teacher = await model.getTeacherInfo(req.cookies.SAI);
	writeAction(`Преподаватель ${teacher.email} создал(-а) шаблон`);

	return {status: 200, id};
}

exports.updateTemplate = async function(req)
{
	if(!req.body.data) 			return {status: 418, message: 'no data'};
	if(!req.body.temp_id)		return {status: 418, message: 'no temp_id'};
	if(!req.body.dz) 			return {status: 418, message: 'no dz'};
	
	let access = await model.getAccess(req.cookies.SAI);
	if(!access) return {status: 403, message: 'access denied'};

	await model.updateDz(req.body.temp_id, req.body.dz);
	await model.deleteContents(req.body.temp_id);
	let data = JSON.parse(req.body.data)

	for(let i = 0; i < data.length; i++) await model.addContent(req.body.temp_id, data[i].type, data[i].content);
	
	let teacher = await model.getTeacherInfo(req.cookies.SAI);

	if(data.length == 0) 
	{
		await model.deleteTemplate(req.body.temp_id);
		writeAction(`Преподаватель ${teacher.email} удалил(-а) шаблон`);
	}
	else writeAction(`Преподаватель ${teacher.email} изменил(-а) шаблон`);
	return {status: 200, message: 'success'};
}

exports.deleteTemplate = async function(req)
{
	if(!req.body.temp_id) 		return{status: 418, message: 'no temp_id'};
	
	let access = await model.getAccess(req.cookies.SAI);
	if(!access) return {status: 403, message: 'access denied'};

	let res = await model.deleteTemplate(req.body.temp_id);

	if(res)
	{
		let teacher = await model.getTeacherInfo(req.cookies.SAI);
		writeAction(`Преподаватель ${teacher.email} удалил(-а) шаблон`);
	}

	if(res) return {status: 200, message: 'success'};
	else 	return {status: 202, message: 'not found'};
}