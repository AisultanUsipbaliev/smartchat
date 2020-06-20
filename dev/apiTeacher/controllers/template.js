let templateModel = require('../../apiModels/template'),
	contentModel = require('../../apiModels/content'),
	groupModel = require('../../apiModels/group'),
	studentModel = require('../../apiModels/student'),
	chartModel = require('../../apiModels/chart'),
	rateModel = require('../../apiModels/rate'),
	levelModel = require('../../apiModels/level')

exports.getTemplates = async (req) => {
	if(!req.body.rate_id) 		return {status: 418, message: 'no rate_id'}
	if(!req.body.lesson) 		return {status: 418, message: 'no lesson'}
	if(!req.body.lvl_id) 		return {status: 418, message: 'no lvl_id'}

	let templates = await templateModel.getTemplates(req.body.myId, req.body.rate_id, req.body.lvl_id, req.body.lesson)
	for (let i=0; i<templates.length; i++) templates[i].contents = await contentModel.getContents(templates[i].temp_id)
	return templates.length ? { status: 200, templates } : { status: 202 }
}

exports.findTemplates = async (req) => {
	if(!req.body.group_id) return {status: 418, message: 'no group_id'}

	let group = await groupModel.getGroup(req.body.group_id)
	if(!group) return {status: 404, message: 'no such group'}

	let lesson = await chartModel.getNextLesson(req.body.group_id)
	if(!lesson) return {status: 404, message: 'no lesson'}

	let students = await studentModel.findGroup(group.group_id)
	if(!students.length) return {status: 404, message: 'no students'}

	let student = students[0]

	let templates = await templateModel.getTemplates(req.body.myId, group.rate_id, lesson, student.lvl)
	for (let i=0; i<templates.length; i++) templates[i].contents = await contentModel.getContents(templates[i].temp_id)
	return templates.length ? { status: 200, templates } : { status: 202 }
}

exports.swapTemplate = async (req) => {
	if(!req.body.first) 	return {status: 418, message: 'no first'};
	if(!req.body.second) 	return {status: 418, message: 'no second'};

	let first = await templateModel.getTemplate(req.body.myId, req.body.first);
	let second = await templateModel.getTemplate(req.body.myId, req.body.second);

	if(!first) return {status: 404, message: 'first not founded'}
	if(!second) return {status: 404, message: 'first not second'}

	await templateModel.changeOrder(second.temp_id, first.order);
	await templateModel.changeOrder(first.temp_id, second.order);

	return {status: 200};
}

exports.addTemplate = async (req) => {
	if(!req.body.rate_id)		return { status: 418, message: 'no rate_id' }
	if(!req.body.lvl_id)		return { status: 418, message: 'no lvl_id' }
	if(!req.body.lesson)		return { status: 418, message: 'no lesson' }
	if(!req.body.contents)		return { status: 418, message: 'no contents'}

	let checkRate = await rateModel.getActiveRate(req.body.rate_id)
	if (!checkRate) return { status: 418, message: 'incorrect rate_id' }

	let lesson = Number(req.body.lesson)

	if (!lesson || lesson<=0 || lesson>checkRate.lessons) return { status: 418, message: 'incorrect lesson' }

	let checkLevel = await levelModel.getLevel(req.body.lvl_id)
	if (!checkLevel.length) return { status: 418, message: 'incorrect lvl_id' }

	let contents = []

	try {
		contents = JSON.parse(req.body.contents);
	} catch(err) {
		return {status: 418, message: 'incorrect json format at field contents'}
	}

	if(!contents.length) return { status: 418, message: 'no contents' };

	let templateId = await templateModel.addTemplate(req.body.myId, req.body.rate_id, req.body.lvl_id, req.body.lesson)
	await templateModel.changeOrder(templateId, templateId)

	if(!templateId) throw new Error('Can\'t add template -> templateModel.addTemplate')

	for(let i = 0; i < contents.length; i++) {
		let contentId = await contentModel.addContent(templateId, contents[i].type, contents[i].content) 
		if(!contentId) throw new Error('Can\'t add content -> templateModel.addContent')
	}

	// writeAction(`Преподаватель ${ req.body.myName } создал(-а) шаблон`)
	return { status: 200, templateId }
}

exports.updateTemplate = async (req) => {
	if(!req.body.temp_id) 	return { status: 418, message: 'no temp_id' }
	if(!req.body.contents)	return { status: 418, message: 'no contents'}

	let contents = []

	try {
		contents = JSON.parse(req.body.contents);
	} catch(err) {
		return {status: 418, message: 'incorrect json format at field contents'}
	}

	if(!contents.length) return { status: 418, message: 'no contents' };

	let template = await templateModel.getTemplate(req.body.myId, req.body.temp_id)
	if(!template) return {status: 404, message: 'no template'}

	let deleted = await contentModel.deleteContents(req.body.temp_id);
	if(!deleted) throw new Error('Can\'t delete content -> templateModel.deleteContents')

	for(let i = 0; i < contents.length; i++) {
		let contentId = await contentModel.addContent(req.body.temp_id, contents[i].type, contents[i].content)
		if(!contentId) throw new Error('Can\'t add content -> templateModel.addContent')
	} 

	// writeAction(`Преподаватель ${ req.body.myName } изменил(-а) шаблон`);
	return { status: 200 };
}

exports.deleteTemplate = async (req) => {
	if(!req.body.temp_id) 		return { status: 418, message: 'no temp_id' }
	
	let template = await templateModel.getTemplate(req.body.myId, req.body.temp_id)
	if(!template) return {status: 404, message: 'no template'}

	let res = await templateModel.deleteTemplate(req.body.temp_id)
	if(!res) throw new Error('Can\'t delete template -> templateModel.deleteTemplate') 
 
	// writeAction(`Преподаватель ${ req.body.myName } удалил(-а) шаблон`) 
	return { status: 200 }
}