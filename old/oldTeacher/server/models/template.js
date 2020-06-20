let SQL = require('../modules/query');

exports.getTemplates = async function(rate, lesson, level)
{
	return await SQL(`
		select t.temp_id, t.rate_id, t.lesson_num, t.teacher_id, l.lvl_name, t.order, t.dz 
		from template t 
		join lvl l on t.lvl_id = l.lvl_id
		where 	l.lvl_id 	= ${level}
		and 	rate_id 	= ${rate} 
		and 	lesson_num 	= ${lesson} 
		and 	t.deleted = false 
		order by t.order`);
}

exports.getContent = async function(id)
{
	return await SQL(`select * from content where temp_id=${id}`);
}

exports.getGroupTemplates = async function(group_id)
{
	return await SQL(`
		select temp_id 
		from template
		where 	rate_id in 		(select rate_id from gr where group_id = ${group_id})
		and 	lesson_num in	(select if(min(lesson), min(lesson), 1) from chart where group_id = ${group_id})
		and 	(lvl_id in		(select lvl from student where group_id = ${group_id}) or rate_id = 1)
		and 	deleted = false
		and 	dz != true
		order by template.order
		`);
}

exports.getTemplateContents = async function(temp_id)
{
	return await SQL(`
		select c.cont_id, c.temp_id, c.type, c.content, t.order 
		from content c
		join template t on t.temp_id = c.temp_id
		where c.temp_id = ${temp_id}`);
}

exports.getUsed = async function(teacher_id, group_id)
{
	return await SQL(`select temp_id from usedtemplate where teacher_id = ${teacher_id} and group_id = ${group_id}`);
}

exports.getTemplate = async function(id)
{
	return (await SQL(`select * from template where temp_id = ${id}`))[0];
}

exports.changeOrder = async function(id, order)
{
	let res = await SQL(`update template t set t.order = ${order} where t.temp_id = ${id}`);	
	if(res.affectedRows > 0) 	return true;
	else 						return false;
}

exports.useTemplate = async function(id, teacher_id, group_id)
{
	let res = await SQL(`insert into usedtemplate(teacher_id, temp_id, group_id) values (${teacher_id}, ${id}, ${group_id})`);
	if(res.affectedRows > 0) 	return true;
	else 						return false;
}

exports.getRates = async function()
{
	return await SQL('select * from rate');
}

exports.getLevels = async function()
{
	return await SQL('select * from lvl');
}

exports.createTemplate = async function(teacher, rate, level, lesson, dz)
{
	let res = await SQL(`insert into template (teacher_id, rate_id, lvl_id, lesson_num, dz) 
										values (${teacher}, ${rate}, ${level}, ${lesson}, ${dz})`);
	if(res.affectedRows > 0) return res.insertId;
	else 					 return false;
}

exports.addContent = async function(id, type, content)
{
	let res = await SQL('insert into content (temp_id, type, content) values (?,?,?)', [id, type, content]);
	if(res.affectedRows > 0) return res.insertId;
	else 					 return false;
}

exports.deleteTemplate = async function(id)
{
	let res = await SQL(`update template set deleted = true where temp_id = ${id}`);
	if(res.affectedRows > 0) 	return true;
	else 						return false;
}

exports.deleteContents = async function(id)
{
	let res = await SQL(`delete from content where temp_id = ${id}`);
	if(res.affectedRows > 0) 	return true;
	else 						return false;
}

exports.getAccess = async function(id)
{
	let [info] = await SQL(`select role from teacher where teacher_id = ${id}`);
	if(info.role == 1) return true;
	else return false;
}


exports.getTeacherInfo = async function(id)
{
	return (await SQL('select * from teacher where teacher_id = ?', id))[0];
}

exports.updateDz = async function(temp_id, dz)
{
	let res = await SQL('update template set dz = ? where temp_id = ?', [dz, temp_id]);
}