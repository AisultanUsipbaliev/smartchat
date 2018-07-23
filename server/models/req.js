let SQL = require('../database/query'); 

exports.DeleteReqS = async function(data)
{
	return await SQL('delete from req where student = ? and teacher = ?', [data.student_id, data.index]);
}
exports.Chat = async function(data)
{
	return await SQL('select chat_id from student where id = ?', [data.student_id]);
}
exports.Graph = async function(data)
{
	return await SQL('select * from graph where teacher = ?', [data.index]);
}
exports.RateInfo = async function(data)
{
	return await SQL('select * from rate where id in (select rate from req where student = ?)', [data.student_id]);
}
exports.DailyChart = async function(data)
{
	return await SQL('select * from chart where day = ? and _group in ( select id from _group where teacher = ?)', 
					[data.today, data.index]);
}
exports.SelectGr = async function(data)
{
	return await SQL('select * from _group where name = ? ', [data.group_name]);
}
exports.CreateGr = async function(data)
{
	return await SQL('insert into _group(name, teacher, type, rate) values (?,?,?,?)', 
					[data.group_name, data.index, data.group_type, data.rate_id]);
}
exports.UpdateStudent = async function(data)
{
	return await SQL('update student set group = ? where id = ?', [data.group_id, data.student_id]);
}
exports.CreateChart = async function(data)
{
	return await SQL('insert into chart(group, day, start, finish, lesson) values(?,?,?,?,?)', 
					[data.group_id, data.day, data.ms1, data.ms2, data.count]);
}
exports.CreateGroupReq = async function(data)
{
	return await SQL('insert into groupRequest(_group, start, finish, nday, teacher) values (?,?,?,?,?)', 
					[data.group_id, data.day, data.ms1, data.ms2, data.ms, data.index]);
}
exports.DeleteReq = async function(data)
{
	return await SQL('delete from request where student = ?', [data.student_id]);
}
exports.ChatId = async function(data)
{
	return await SQL('select chat_id from student where id = ?', [data.student_id]);
}
exports.GroupName = async function(data)
{
	return await SQL('select name from _group where id = ?', [data.group_id]);
}
exports.CheckSh = async function(data)
{
	return await SQL('select * from chart where group = ?', [data.group_id]);
}
exports.ChechAmount = async function(data)
{
	return await SQL('select count(*) as count from student group by group having group = ?', 
					[data.group_id]);
}
exports.Lessons = async function(data)
{
	return await SQL('select lessons from rate where id in (select rate from _group where id = ?)', [data.group_id]);
}
exports.Greq = async function(data)
{
	return await SQL('select * from groupReuest where _group = ?', [data.group_id]);
}
exports.DailyChartD = async function(data)
{
	return await SQL('select * from chart where _group in (select id from _group where teacher = ?) and day = ?', 
					[data.index, data.day]);
}
exports.DeleteGroupReq = async function(data)
{
	return await SQL('delete from groupRequest where _group = ?', [data.group_id]);
}
exports.SelectLevel = async function(data)
{
	return await SQL('select level from student where id = ?', [data.student_id]);
}
exports.SelectReq = async function(data)
{
	return await SQL('select * from request where student = ?', [data.student_id]);
}
exports.Groups = async function(data)
{
	return await SQL(`
						select g.name, g.id, count(s.id) as kol
						from _group g
						join studentGroup s on s._group = g.id
						where g.level = ?
						and g.teacher = ?
						and g.rate = ?
						group by g.id
						having count(s.id) <= ${data.students}`, 
						[data.lvl, data.index, data.reqs]);
}
exports.GrReq = async function(data)
{
	return await SQL('select * from groupRequest where _group = ?', [data.group.group_id]);
}
exports.TeacherLevel = async function(data)
{
	return await SQL('select level from teacher where id = ?', [data.index]);
}
exports.Re = async function(data)
{
	return await SQL(`
					select s.id, s.firstname, s.lastname, s.level, l.name, r.dt, r.rate, rt.lessons
					from student s, level l, request r, rate rt
					where s.level = level.id
					and s.id = r.student
					and (r.level <= ? or r.level = 8)
					and r.teacher = ?
					and r.rate = rt.id
					group by s.id
					order by rt.lessons DESC`, 
					[data.level, data.index]);
}
exports.Select = async function(data)
{
	return await SQL(
					`select r.start, r.finish, r.nday, r.dt, rt.id, rt.name, rt.title,
					rt.cost, rt.lessons, rt.unlim, rt.type 
					from request r, rate rt
					where r.student = ?
					and r.rate = rt.id
					order by nday`, 
					[data.student_id]);
}