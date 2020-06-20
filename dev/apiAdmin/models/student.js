const SQL = require('../functions/query');

exports.getFilteredStudentList = async (filter, column, order, from, limit, text) =>
{
	return await SQL(`select s.student_id, concat(s.firstname, ' ', s.lastname) as fio, s.phone, s.email, concat(t.login, ' ', t.lastname) as teacher_full_name, r.rate_name,  s.blocked, s.stream, t.teacher_id from student s
										left join gr g on g.group_id = s.group_id
										left join teacher t on t.teacher_id = g.teacher_id
										left join rate r on r.rate_id = g.rate_id
										where s.blocked = ? 
										and (
											concat(t.login, ' ', t.lastname) like concat('%', ? ,'%') 
											or concat(s.firstname, ' ', s.lastname) like concat('%', ? ,'%')
											or s.email like concat('%', ? ,'%')
											or s.phone like concat('%', ? ,'%')
											or r.rate_name like concat('%', ? ,'%')
										)
										order by ? ${order} limit ?, ?`, [filter,text,text,text,text,text,column,from,limit]);
}
exports.getStudentList = async (column, order, from, limit, text) =>
{
	return await SQL(`select s.student_id, concat(s.firstname, ' ', s.lastname) as fio, s.phone, s.email, concat(t.login, ' ', t.lastname) as teacher_full_name, r.rate_name,  s.blocked, s.stream, t.teacher_id from student s
										left join gr g on g.group_id = s.group_id
										left join teacher t on t.teacher_id = g.teacher_id
										left join rate r on r.rate_id = g.rate_id
										where (
											concat(t.login, ' ', t.lastname) like concat('%', ? ,'%') 
											or concat(s.firstname, ' ', s.lastname) like concat('%', ? ,'%')
											or s.email like concat('%', ? ,'%')
											or s.phone like concat('%', ? ,'%')
											or r.rate_name like concat('%', ? ,'%')
										)
										order by ? ${order} limit ?, ?`, [text,text,text,text,text,column,from,limit]);
}
exports.getSelectedSuitableGroup = async (student_id) =>
{
	return await SQL(`select g.group_id, g.group_name, g.group_type, t.teacher_id, concat(t.login, ' ', t.lastname) as fio, r.rate_id, r.rate_name, count(c.group_id) as lesson_count
										from gr g
										join teacher t on t.teacher_id = g.teacher_id
										join chart c on c.group_id = g.group_id
										join rate r on r.rate_id = g.rate_id
										join gr sg on sg.rate_id = g.rate_id
										join student s on s.group_id = sg.group_id
										where s.student_id = ?
										group by c.group_id
										having count(c.group_id) = 
										(
											select count(*) from chart 
											join student on chart.group_id = student.group_id 
											where student_id = ?
										);`, [student_id, student_id]);
}
exports.getLearningProcessChartInfo = async (student_id) =>
{
	return await SQL(`select c.chart_id, c.start, c.finish, c.lesson, r.lessons,
										false as editing, 
										'white' as start_day_color, 
										'white' as finish_day_color, 
										'white' as start_time_color,
										'white' as finish_time_color
										from student s
										join chart c on c.group_id = s.group_id 
										join gr g on g.group_id = s.group_id
										join rate r on r.rate_id = g.rate_id
										where s.student_id = ? order by c.lesson`, [student_id]);
}
exports.getRegSheduleDay = async (student_id) =>
{
	return await SQL(`select nday
										from req 
										where student_id = ?
										group by nday;`, [student_id]);
}
exports.getSelectedAllGroup = async () =>
{
	return await SQL(`select g.group_id, g.group_name, g.group_type, t.teacher_id, concat(t.login, ' ', t.lastname) as fio, r.rate_id, r.rate_name, count(c.chart_id) as lesson_count
										from gr g 
										join teacher t on t.teacher_id = g.teacher_id
										left join chart c on c.group_id = g.group_id
										join rate r on r.rate_id = g.rate_id
										group by g.group_id;`);
}
exports.getLearningProcessMainInfo = async (student_id) =>
{
	return (await SQL(`	select g.group_id, g.group_type, g.group_name, t.teacher_id, concat(t.login, ' ', t.lastname) as teacher_name, r.rate_id, r.rate_name, r.lessons
											from student s
											join gr g on g.group_id = s.group_id
											join teacher t on t.teacher_id = g.teacher_id
											join rate r on r.rate_id = g.rate_id
											where s.student_id = ?;`, [student_id]))[0];
}
exports.getRegMainInfo = async (student_id) =>
{
	return (await SQL(`	select req.req_id, req.student_id, req.rate_id, r.rate_name, req.teacher_id, concat(t.login, ' ', t.lastname) as teacher_name, date_format(req.req_dt,'%d.%m.%Y %T') as req_dt
											from req 
											join teacher t on t.teacher_id = req.teacher_id
											join rate r on r.rate_id = req.rate_id
											where req.student_id = ?
											group by req.student_id;`, [student_id]))[0];
}
exports.GetSelectedAllTeacher = async () =>
{
	return await SQL(`select t.teacher_id, concat(t.login, ' ', t.lastname) as fio, count(g.group_id) as group_count 
										from teacher t
										left join gr g on g.teacher_id = t.teacher_id
										where t.blocked = 0
										group by t.teacher_id;`);
}
exports.getSelectedRate = async () =>
{
	return await SQL(`select * from rate`);
}
exports.getStudentList2 = async () =>
{
	return await SQL(`select s.student_id, concat(s.firstname, ' ', s.lastname) as fio 
										from student s
										where s.blocked = 0 
										and group_id = 0`);
}
exports.getTeacherList2 = async () =>
{
	return await SQL(`select t.teacher_id, concat(t.login, ' ', t.lastname) as fio
										from teacher t
										where t.blocked = 0`);
}
exports.getChartInfo = async (student_id) =>
{
	return (await SQL(` select g.group_id, g.group_name, min(c.start) as start
											from student s 
											left join gr g on g.group_id = s.group_id
											left join chart c on c.group_id = s.group_id
											where s.student_id = ?;`, [student_id]))[0];
}
exports.getStudentByChartId = async (chart_id) =>
{
	return await SQL(`select s.student_id from chart c
										join gr g on g.group_id = c.group_id
										left join student s on s.group_id = g.group_id
										where c.chart_id = ?;`, [chart_id]);
}
exports.getStudentInfo = async (student_id) =>
{
	return (await SQL(`	select s.student_id,s.firstname,s.lastname,s.phone,s.email,s.ava,s.stream,date_format(s.birthday,'%d.%m.%Y') as birthday,s.blocked,s.activated,s.is_active,date_format(s.lastVisit,'%H:%i %d.%m.%Y') as lastVisit,date_format(s.regDate,'%H:%i %d.%m.%Y') as regDate,l.lvl_id,l.lvl_name,concat('UTC ',s.timeDifference) as timeDifference,s.smsOn,s.mailOn,s.guide
											from student s
											left join lvl l on l.lvl_id = s.lvl
											where student_id = ?;`, [student_id]))[0];
}
exports.getRegSheduleTime = async (student_id, nday) =>
{
	return await SQL(`select start_time, finish_time from req where student_id = ? and nday = ?;`, [student_id, nday]);
}
exports.getStudentPSM = async (student_id) =>
{
	return (await SQL(`select firstname, lastname, smsOn, mailOn, pushTokens, email, phone, timeDifference from student where student_id = ?`, [student_id]))[0];
}
exports.getSelectedLevel = async () =>
{
	return await SQL(`select * from lvl`);
}
exports.getVisitHistory = async (student_id, order, from, to) =>
{
	return await SQL(`select agent, ip, date_format(dt,'%H:%i %d.%m.%Y') as dt
										from ingress i
										join student s on i.user = s.student_id
										where user = ? and isteacher = 0
										order by dt ${order} limit ?, ?;`, [student_id, from, to]);
}
exports.blockStudent = async (id) =>
{
	return (await SQL('update student set blocked = 1 where student_id = ?', [id])).affectedRows > 0 ? true: false;
}
exports.unblockStudent = async (id) =>
{
	return (await SQL('update student set blocked = 0 where student_id = ?', [id])).affectedRows > 0 ? true: false;
}
exports.openStream = async (id) =>
{
	return (await SQL('update student set stream = 1 where student_id = ?', [id])).affectedRows > 0 ? true: false;
}
exports.closeStream = async (id) =>
{
	return (await SQL('update student set stream = 0 where student_id = ?', [id])).affectedRows > 0 ? true: false;
}
exports.activateStudentPhone = async (id) =>
{
	return (await SQL('update student set is_active = 1 where student_id = ?', [id])).affectedRows > 0 ? true: false;
}
exports.deactivateStudentPhone = async (id) =>
{
	return (await SQL('update student set is_active = 0 where student_id = ?', [id])).affectedRows > 0 ? true: false;
}
exports.activateStudentEmail = async (id) =>
{
	return (await SQL('update student set activated = 1 where student_id = ?', [id])).affectedRows > 0 ? true: false;
}
exports.deactivateStudentEmail = async (id) =>
{
	return (await SQL('update student set activated = 0 where student_id = ?', [id])).affectedRows > 0 ? true: false;
}
exports.deleteStudent = async (id) =>
{
	return (await SQL('delete from student where student_id = ?', id)).affectedRows > 0 ? true: false;
}
exports.updateStudentGroup = async (student_id, group_id) =>
{
	return (await SQL('update student set  group_id = ? where student_id = ?', [group_id, student_id])).affectedRows > 0 ? true: false;
}
exports.updateStudentChart = async (chart_id, start, finish, lesson) =>
{
	return (await SQL('update chart set  start = ?, finish = ?, lesson = ? where chart_id = ?', [start, finish, lesson, chart_id])).affectedRows > 0 ? true: false;
}
exports.createStudentChart = async (group_id, start, finish, lesson) =>
{
	return (await SQL('insert into chart (start, finish, lesson, group_id) values (?,?,?,?)', [start, finish, lesson, group_id])).affectedRows > 0 ? true: false;
}
exports.updateStudentLevel = async (student_id, level_id) =>
{
	return (await SQL('update student set lvl = ? where student_id = ?', [level_id, student_id])).affectedRows > 0 ? true: false;
}
exports.deleteStudentChart = async (chart_id) =>
{
	return (await SQL('delete from chart where chart_id = ?', chart_id)).affectedRows > 0 ? true: false;
}
exports.updateStudentRegTeacher = async (student_id, teacher_id) =>
{
	return (await SQL('update req set  teacher_id = ? where student_id = ?', [teacher_id, student_id])).affectedRows > 0 ? true: false;
}
exports.updateStudentGroupTeacher = async (group_id, teacher_id) =>
{
	return (await SQL('update gr set teacher_id = ? where group_id = ?', [teacher_id, group_id])).affectedRows > 0 ? true: false;
}
exports.updateStudentGroupRate = async (group_id, rate_id) =>
{
	return (await SQL('update gr set rate_id = ? where group_id = ?', [rate_id, group_id])).affectedRows > 0 ? true: false;
}
exports.updateStudentPassword = async (password, student_id) =>
{
	return (await SQL('update student set pass = ? where student_id = ?', [password, student_id])).affectedRows > 0 ? true: false;
}
exports.enableStudentSmsOn = async (student_id) =>
{
	return (await SQL('update student set smsOn = 1 where student_id = ?', [student_id])).affectedRows > 0 ? true: false;
}
exports.disableStudentSmsOn = async (student_id) =>
{
	return (await SQL('update student set smsOn = 0 where student_id = ?', [student_id])).affectedRows > 0 ? true: false;
}
exports.enableStudentMailOn = async (student_id) =>
{
	return (await SQL('update student set mailOn = 1 where student_id = ?', [student_id])).affectedRows > 0 ? true: false;
}
exports.disableStudentMailOn = async (student_id) =>
{
	return (await SQL('update student set mailOn = 0 where student_id = ?', [student_id])).affectedRows > 0 ? true: false;
}
exports.updateStudentGuide = async (student_id, str) =>
{
	return (await SQL('update student set guide = ? where student_id = ?', [str, student_id])).affectedRows > 0 ? true: false;
}