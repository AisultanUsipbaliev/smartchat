 let SQL = require('../modules/query')

exports.getTeacherLevel = async function(id) {
	return (await SQL('select lvl from teacher where teacher_id = ?', id))[0].lvl
}

exports.getRequests = async function(id, level) {
	return await SQL(`
		SELECT student.student_id, firstname, lastname, lvl, lvl_name, req_dt, req.rate_id, lessons 
		FROM student
		JOIN lvl ON lvl.lvl_id = student.lvl
		JOIN req ON req.student_id = student.student_id
		JOIN rate ON rate.rate_id = req.rate_id
		WHERE req.teacher_id = ?
		AND (lvl <= ? OR lvl = 8) 
		GROUP BY student.student_id 
		ORDER BY lessons DESC`, [id, level])
}

exports.getGraph = async function(student_id) {
	return await SQL(`
		select start_time, finish_time, nday, req_dt, rate.rate_id, rate_name, rate_title, 
		rate_cost, lessons, unlim, group_type
		from req
		join rate on req.rate_id = rate.rate_id
		where student_id = ?
		order by nday `, student_id)
}

exports.deleteReq = async function(student_id, teacher_id) {
	return (await SQL('delete from req where student_id = ? and teacher_id = ?', [student_id, teacher_id]))
	.affectedRows > 0? true:false
}

exports.getStudent = async function(id) {
	return (await SQL('select * from student s join lvl l on l.lvl_id = s.lvl where student_id = ?', id))[0];
}
exports.getTeacher = async function(id) {
	return (await SQL('select * from teacher where teacher_id = ?', id))[0];
}

exports.getReqs = async function(id) {
	return await SQL('select * from req where student_id = ?', id);
}
exports.getGroupReqs = async function(id) {
	return await SQL('select * from group_req where group_id = ?', id);
}

exports.getGroups = async function(teacher_id, rate_id, level, maxStudents)
{
	return await SQL(`
		select gr.group_name, gr.group_id, count(student.student_id) as kol
		from gr 
		join student on student.group_id = gr.group_id
		where student.lvl = ? 
		and gr.teacher_id = ?
		and gr.rate_id = ?
		group by gr.group_id
		having count(student.student_id) <= ?
		`, [level, teacher_id, rate_id, maxStudents]);
}

exports.getRate = async function(id) {
	return (await SQL('select * from rate where rate_id = ?', id))[0];
}

exports.updateStudentGroup = async function(id, group) {
	let res = await SQL('update student set group_id = ? where student_id = ?', [group, id]);
	if(res.affectedRows > 0) return true; else return false;
}

exports.checkChart = async function(group_id)
{
	let res = await SQL('select * from chart where group_id = ?', group_id);
	return res.length > 0 ? true: false;
}

exports.getStudentsAmount = async function(group_id)
{
	return (await SQL('select count(*) as amount from student where group_id = ?', group_id))[0].amount;
}

exports.getChart = async function(teacher_id) {
	return await SQL(`
		select c.chart_id, c.group_id, c.start, c.finish, c.lesson
		from chart c
		join gr g on g.group_id = c.group_id
		where g.teacher_id = ?`, [teacher_id]);
}

exports.createChart = async function(group_id, start, finish, lesson) {
	return (await SQL('insert into chart(group_id, start, finish, lesson)  values(?,?,?,?)',
		[group_id, start, finish, lesson])).insertId;
}
exports.deleteGroupReqs = async function(id) {
	let res = await SQL('delete from group_req where group_id = ?', id);
	return res.affectedRows > 0 ? true : false; 
}

exports.getTeacherGraph = async function(id) {
	return await SQL('select * from graph where teacher_id = ?', id);
}

exports.getGroupWhithName = async function(teacher_id, group_name)
{
	return (await SQL('select * from gr where teacher_id = ? and group_name = ?', [teacher_id, group_name]))[0];
}

exports.createGroup = async function(group_name, teacher_id, group_type, rate_id)
{
	return (await SQL('insert into gr(group_name, teacher_id, group_type, rate_id) values (?,?,?,?)', 
		[group_name, teacher_id, group_type, rate_id])).insertId;
}

exports.createGroupReq = async function(group_id, start_time, finish_time, nday, teacher_id)
{
	return (await SQL('insert into group_req(group_id, start_time, finish_time, nday, teacher_id) values (?,?,?,?,?)', 
		[group_id, start_time, finish_time, nday, teacher_id])).insertId;
}

// for sockets
exports.getStudentsByGroup = async function(group) {
	return await SQL('select student_id from student where group_id = ?', group);
}
exports.createNotice = async function(id, content, isteacher) {
	return (await SQL('insert into notice(user_id, content, isteacher) values (?,?,?)', [id, content, isteacher])).insertId;
}

exports.countCrosses = async function(teacher, start, finish) {
	return (await SQL(`
		select count(*) as cnt 
		from chart c left 
		join gr g on g.group_id = c.group_id and g.teacher_id = ?
		where (start < ${start} && finish > ${start} ) 
		|| (start < ${finish} && finish > ${finish})  
		|| (start = ${start} && finish = ${finish}) 
		|| (start > ${start} && start < ${finish})
		|| (finish > ${start} && finish < ${finish})`, teacher ))[0].cnt
}