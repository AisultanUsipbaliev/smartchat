let SQL = require('../database/query');

exports.FirstInfo = async function(data)
{
	return await SQL('select * from template where id = ?', [data.first]);
}

exports.UpdateFirst = async function(data)
{
	return await SQL('update template as t set t.order = ? where t.temp_id = ?', 
					[data.firstInfoOrder, data.secondInfoTemp_id]);
}

exports.TemplateId = async function(data) 
{
	return await SQL(`
					select t.id 
					from template t 
			        where t.rate in 
			        	(select rate from _group where id = ?) 
			        and lesson_num in 
			        	(select min(lesson) from chart where _group = ?) 
			        and t.level in 
			        	(select level from student where _group = ?) 
			        and t.teacher = ? order by t.order`, 
			        [data.group_id, data.group_id, data.group_id, data.index]);
}
exports.Templates = async function(data)
{
	return await SQL('select * from content where template = ? ', [data.template_id]);
}
exports.UsedTemps = async function(data)
{
	return await SQL('select template from usedtemplate where teacher = ? and _group = ?', 
            		[data.index, data.group_id]);
}
exports.Used = async function(data)
{
	return await SQL('insert into usedtemplate(teacher, template, _group) values (?,?,?)', 
        			[data.index, data.temp_id, data.group_id]);
}
exports.TeacherLevel = async function(data)
{
	return await SQL('select level from teacher where id = ?', 
					[data.index]);
}
exports.Rate = async function()
{
	return await SQL('select * from rate');
}
exports.Level = async function()
{
	return await SQL('select * from level');
}
exports.Lesson = async function(data)
{
	return await SQL('select id, lessons from rate where id = ?', 
					[data.rate_id]);
}
exports.Temp = async function(data)
{
	return await SQL(`
					select t.id, t.rate, t.lesson, t.teacher, l.name, t.order 
			        from template t, level l 
			        where l.id = ? 
			        and t.rate = ? 
			        and t.teacher = ? 
			        and t.lesson = ? 
			        and t.level = l.id 
			        order by t.order`, 
			        [data.lvl_id, data.rate_id, data.index, data.lesson_num]);
}
exports.Content = async function(data)
{
	return await SQL('select * from content where template = ?', [data.temp_id]);
}
exports.TempPost = async function(data)
{
	return await SQL('insert into template (rate, teacher, lesson, level) values (?,?,?,?)', 
					[data.rate_id, data.index, data.lesson_num, data.lvl_id]);
}
exports.W = async function(data)
{
	return await SQL('update template as t set t.order = ? where id = ?', 
					[data.tempInsertId, data.tempInsertId]);
}
exports.Cont = async function(data)
{
	return await SQL('insert into content (template, type, content) values (?,?,?)', 
					[data.tempId, data.type, data.content]);
}
exports.NewContent = async function(data)
{
	return await SQL('select * from content where template=?', 
					[data.tempId]);
}
exports.TempInfo = async function(data)
{
	return await SQL(`select * from template where id = ?`, 
					[data.tempId]);
}
exports.DeleteContent = async function(data)
{
	return await SQL('delete from content where template = ?', 
					[data.temp_id]);
}
exports.DeleteTemplate = async function(data)
{
	return await SQL('delete from template where id = ?', 
					[data.temp_id]);
}
