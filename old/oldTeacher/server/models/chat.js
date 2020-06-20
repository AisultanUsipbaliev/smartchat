let SQL = require('../modules/query');

exports.getChat = async function(teacher_id, group_id) {
	return await SQL(`	select c.mes_id, c.group_id, c.sender_id, c.dt, c.content, c.title, c.type, c.isteacher, c.isread, s.firstname, 
						c.reference, ch.title refTitle, ch.content refContent, ch.type refType, 
						IF( ch.isteacher = 1, concat(t.login, ' ', t.lastname), st.firstname) as refSender
						from chat c
						left join student s on c.sender_id = s.student_id
						left join chat ch on ch.mes_id = c.reference
						left join student st on ch.sender_id = st.student_id 
						left join teacher t on ch.sender_id = t.teacher_id
						where c.group_id = ? 
						and c.delivered = true
						order by dt desc 
						limit 30`, 
						[group_id]);
}

exports.getPartChat= async function(teacher_id, group_id, mes_id) {
	return await SQL(`  select c.mes_id, c.group_id, c.sender_id, c.dt, c.content, c.title, c.type, c.isteacher, c.isread, s.firstname, 
						c.reference, ch.title refTitle, ch.content refContent, ch.type refType, 
						IF( ch.isteacher = 1, concat(t.login, ' ', t.lastname), st.firstname) as refSender
						from chat c
						left join student s on c.sender_id = s.student_id
						left join chat ch on ch.mes_id = c.reference
						left join student st on ch.sender_id = st.student_id 
						left join teacher t on ch.sender_id = t.teacher_id
						where c.group_id = ? 
						and c.mes_id < ?
						and c.delivered = true
						order by dt desc 
						limit 30`, 
						[group_id, mes_id]);
}
 
exports.isreadChat = async function(group_id) {
	let updated = await SQL('update chat set isread = 1 where group_id = ? and delivered = 1', group_id);
	if(updated.affectedRows > 0) 	return true;
	else 							return false;
}

exports.getGrByTeacherId = async function(teacher_id, time) {
	return await SQL(`  select g.group_id, g.teacher_id, g.group_name, g.started, g.group_type, g.rate_id, 
						max(c.dt) as dt ,
						if(ch.start<= ? and ch.finish>= ?, true, false) as lesson
						from gr g
						left join chat c on c.group_id = g.group_id
						join chart ch on ch.group_id = g.group_id
						where g.teacher_id = ?
						and g.group_id in (select group_id from student s group by s.group_id)
						group by g.group_id order by dt desc`, [time,time,teacher_id])
}

exports.getGrAndCountMess = async function()
{
	return await SQL(`	select gr.group_id, count(mes_id) as count 
						from gr 
						join chat on gr.group_id = chat.group_id 
						where gr.group_id in 
						(select group_id from student group by group_id) 
						and isteacher = 0 
						and delivered = 1
						and isread = 0`);
}

exports.getTestByTeacherIdAndGroupId = async function(teacher_id, group_id)
{
	return await SQL(`	select t.test_id , t.test_name, t.test_lvl from test t
						join lvl l on l.lvl_id = t.test_lvl
						join student s on s.lvl = l.lvl_id
						where t.teacher_id = ?
						and t.test_id not in (select test_id from result res join student st on st.student_id = res.student_id where st.group_id = ?)
						and s.group_id = ?
						group by t.test_id;
						`, [teacher_id, group_id, group_id]);
}

exports.getHomework = async function(group_id)
{
	return await SQL(`	select DISTINCT t.temp_id template_id, t.lesson_num template_lesson, c.content title
						from template t
						join content c on c.temp_id = t.temp_id and c.type = 1
						join gr g on g.rate_id = g.rate_id and g.group_id = ?
						join student s on s.group_id = g.group_id
						where t.lvl_id = s.lvl
						and t.dz = 1
						and t.temp_id not in (
							select template
							from homework h 
							join student s on h.student = s.student_id
							where s.group_id = ?
						)
						order by t.lesson_num;`, [group_id, group_id]);
}