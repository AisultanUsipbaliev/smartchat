const SQL = require('../functions/query');

exports.getTeacherList = async (column, order, from, limit, text) =>
{
	return await SQL(`select t.teacher_id, concat(login, ' ', lastname) as fio, round(avg(r.value), '2') as rating, role, email, blocked from teacher t
										left join rating r on r.teacher_id = t.teacher_id
										where (
											role like concat('%', ? ,'%')
											or concat(login, ' ', lastname) like concat('%', ? ,'%')
											or email like concat('%', ? ,'%')
										)
										group by t.teacher_id
										order by ? ${order} limit ?, ?`, [text, text, text, column, from, limit]);
}
exports.getFilteredTeacherList = async (filter, column, order, from, limit, text) =>
{
	return await SQL(`select t.teacher_id, concat(login, ' ', lastname) as fio, round(avg(r.value), '2') as rating, role, email, blocked from teacher t
										left join rating r on r.teacher_id = t.teacher_id 
										where blocked = ?
										and (
											role like concat('%', ? ,'%')
											or concat(login, ' ', lastname) like concat('%', ? ,'%')
											or email like concat('%', ? ,'%')
										)
										group by t.teacher_id 
										order by ? ${order} limit ?, ?`, [filter, text, text, text, column, from, limit]);
} 
exports.getTeacherGroupList = async (teacher_id) =>
{
	return await SQL(`select r.rate_id, r.rate_name, g.group_id, g.group_name, c.chart_id, c.start, c.finish, c.lesson, r.lessons, null as editing, null as loading, null as temp_lesson, null as temp_start_day, null as temp_finish_day, null as temp_start_time, null as temp_finish_time
										from teacher t
										left join gr g on g.teacher_id = t.teacher_id
										join chart c on c.group_id = g.group_id
										join rate r on r.rate_id = g.rate_id
										where t.teacher_id = ?;`, [teacher_id]);
}
exports.getTeacherSheduleList = async (teacher_id) =>
{
	return await SQL(`select g.nday, g.start_time as start, g.finish_time as finish
									  from graph g
									  where teacher_id = ?`,[teacher_id]);
}
exports.getTeacherBalance = async (teacher_id) =>
{
	return await SQL(`select b.amount, b.currency, b.comment, b.dt
									  from balance b
									  where teacher = ?`,[teacher_id]);
}
exports.getTeacherInfo = async (teacher_id) =>
{
	return (await SQL(`	select t.teacher_id, t.login, t.lastname, t.phone, t.email, l.lvl_id, l.lvl_name, t.ava, t.les_count, if(t.role, 'Старший преподаватель', 'Младший пеподаватель') as role_name, t.role, t.activated, t.is_active, t.blocked, round(t.rating, 2) as rating, t.smsOn, t.mailOn, t.lastVisit, sum(b.amount) as amount, b.currency
											from teacher t
											left join lvl l on l.lvl_id = t.lvl
											left join balance b on b.teacher = t.teacher_id
											where t.teacher_id = ?;`, [teacher_id]))[0];
}
exports.getTeacherPSM = async (teacher_id) =>
{
	return (await SQL(`	select login, lastname, smsOn, mailOn, email, phone, null as temp_lesson, '[]' as pushTokens 
											from teacher where teacher_id = ?`, [teacher_id]))[0];
}
exports.getSelectedLevel = async () =>
{
	return await SQL(`select * from lvl`);
}
exports.updateTeacherLevel = async (teacher_id, level_id) =>
{
	return (await SQL('update teacher set lvl = ? where teacher_id = ?', [level_id, teacher_id])).affectedRows > 0 ? true: false;
}
exports.activateTeacherPhone = async (teacher_id) =>
{
	return (await SQL('update teacher set activated = 1 where teacher_id = ?', [teacher_id])).affectedRows > 0 ? true: false;
}
exports.deactivateTeacherPhone = async (teacher_id) =>
{
	return (await SQL('update teacher set activated = 0 where teacher_id = ?', [teacher_id])).affectedRows > 0 ? true: false;
}
exports.activateTeacherEmail = async (teacher_id) =>
{
	return (await SQL('update teacher set is_active = 1 where teacher_id = ?', [teacher_id])).affectedRows > 0 ? true: false;
}
exports.deactivateTeacherEmail = async (teacher_id) =>
{
	return (await SQL('update teacher set is_active = 0 where teacher_id = ?', [teacher_id])).affectedRows > 0 ? true: false;
}
exports.enableTeacherSmsOn = async (teacher_id) =>
{
	return (await SQL('update teacher set smsOn = 1 where teacher_id = ?', [teacher_id])).affectedRows > 0 ? true: false;
}
exports.disableTeacherSmsOn = async (teacher_id) =>
{
	return (await SQL('update teacher set smsOn = 0 where teacher_id = ?', [teacher_id])).affectedRows > 0 ? true: false;
}
exports.enableTeacherMailOn = async (teacher_id) =>
{
	return (await SQL('update teacher set mailOn = 1 where teacher_id = ?', [teacher_id])).affectedRows > 0 ? true: false;
}
exports.disableTeacherMailOn = async (teacher_id) =>
{
	return (await SQL('update teacher set mailOn = 0 where teacher_id = ?', [teacher_id])).affectedRows > 0 ? true: false;
}
exports.updateTeacherPassword = async (password, teacher_id) =>
{
	return (await SQL('update teacher set pass = ? where teacher_id = ?', [password, teacher_id])).affectedRows > 0 ? true: false;
}
exports.blockTeacher = async (id) =>
{
	return (await SQL('update teacher set blocked = 1 where teacher_id = ?', [id])).affectedRows > 0 ? true: false;
}
exports.unblockTeacher = async (id) =>
{
	return (await SQL('update teacher set blocked = 0 where teacher_id = ?', [id])).affectedRows > 0 ? true: false;
}
exports.deleteTeacher = async (teacher_id) =>
{
	return (await SQL('delete from teacher where teacher_id = ?', teacher_id)).affectedRows > 0 ? true: false;
}
exports.editRole = async (role, teacher_id) =>
{
	return (await SQL('update teacher set role = ? where teacher_id = ?', [role, teacher_id])).affectedRows > 0 ? true: false;
}
exports.updateTeacherShedule = async (teacher_id, start, finish, nday) =>{
	return (await SQL(`update graph set start_time = ?, finish_time = ?
										 where teacher_id = ? and nday = ?`, [start, finish, teacher_id, nday]))
}
exports.insertTeacherShedule = async (teacher_id, start, finish, nday) =>{
	return (await SQL(`insert into graph (start_time, finish_time, nday, teacher_id) values (?, ?, ?, ?)`, [start, finish, nday, teacher_id]))
}
