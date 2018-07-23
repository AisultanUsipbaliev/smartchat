let SQL = require('../database/query');

exports.Students = async function(data)
{
	return await SQL(`
					select s.firstname, s.lastname, s.ava, s.id 
					from student s
					join studentGroup sg on sg.user = s.id
					join _group g on g.id = sg._group 
					where g.teacher = ?`, 
					[data.index]);
}
exports.Student = async function(data)
{
	return await SQL(`
					select 
						s.firstname, 
						s.lastname, 
						s.phone, 
						s.email, 
						s.ava , 
						s.id as student_id, 
						g.id as group_id, 
						g.name as group_name, 
						g.type as group_type, 
						l.name as level_name, 
						rt.name as rate_name, 
						rt.lessons 
					from student s, level l, _group g, rate rt 
					join studentGroup sg on s.id = sg.user
					where l.id = s.level 
					and g.id = sg._group 
					and g.rate = rt.id 
					and s.id = ?`, 
					[data.student_id]);
}
exports.Dat = async function(data)
{
	return await SQL(`
					select min(c.day) as day 
					from studentGroup sg 
					join chart c on sg._group = c._group
					where sg.user = ? group by c._group`, 
					[data.student_id]);
}
exports.Chart = async function(data)
{
	return await SQL(`
					select c.day, c.start, c.finish 
					from studentGroup sg 
					join chart c on sg._group = c._group 
					where sg.user = ? and c.day > ? and c.day < ?`, 
					[data.student_id, data.dateone, data.datetwo]);
} 
