let SQL = require('../modules/query');

exports.getChartByTeacherId = async function(teacher_id) {
	return await SQL('select * from chart c join gr on gr.group_id = c.group_id where gr.teacher_id = ?', teacher_id);
}

exports.getChartByTeacherIdAndDay = async function(teacher_id, begin, end)
{
	return await SQL(`	select group_type, group_name, g.group_id, start, finish, lvl_name 
						from chart c
						join gr g on g.group_id = c.group_id
						left join student s on s.group_id = c.group_id
						left join lvl l on l.lvl_id = s.lvl
						where g.teacher_id = ?
						and ((c.start >= ? and c.start <= ?) or (c.finish >= ? and c.start <= ?))
						group by g.group_id 
						order by c.start`, [teacher_id, begin, end, begin, end]);
}

exports.getGraphByTeacherId = async function(teacher_id) {
	return await SQL(`select * from graph where teacher_id = ?`, teacher_id);
}