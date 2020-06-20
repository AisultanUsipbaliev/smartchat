
const SQL = require('../database/query');

exports.getRateInfo = async function(rate_id) {
	return (await SQL(` SELECT * FROM rate WHERE rate_id = ?`, [rate_id]))[0];  
}

exports.getTeachers = async function() {
	return await SQL(`  SELECT t.teacher_id, t.login, t.lastname, t.phone, t.email, t.lvl, t.ava, t.les_count, 
						(SELECT SUM( r.value)/COUNT(r.value) FROM rating r WHERE r.teacher_id = t.teacher_id) AS rating
						FROM teacher t
						where t.blocked = 0 and (t.teacher_id = 10 or t.teacher_id = 59)`);
}

exports.getGraph = async function(teacher_id) {
	return await SQL(`  SELECT graph.nday, graph.start_time, graph.finish_time FROM graph
						WHERE graph.teacher_id = ?`, [teacher_id]);
}
exports.getTeacherChart = async function(teacher_id) {
	return await SQl('select c.start, c.finish from chart c join gr g on g.group_id = c.group_id where g.teacher_id = ?', teacher_id)
} 

exports.createRequest = async function (student_id, start_time, finish_time, nday, rate_id, teacher_id) {
	let inserted = await SQL(`  INSERT INTO req (student_id, start_time, finish_time, nday, rate_id, teacher_id) 
								VALUES (?,?,?,?,?,?)`, 
								[student_id, start_time, finish_time, nday, rate_id, teacher_id]);
	
	if (inserted.affectedRows > 0)	return true;
	else							return false;
}

exports.deleteRequest = async function (student_id) {
	let deleted = await SQL(`DELETE FROM req WHERE student_id = ?`, [student_id]);
	
	if (deleted.affectedRows > 0)	return true;
	else							return false;
}

exports.getTrial = async function(teacher_id, student_id) {
	let res = await SQL('select * from trial where teacher_id = ? and student_id = ?', [teacher_id, student_id]);
	if(res.length > 0)  return true
	else                return false
}

exports.addTrial = async function(teacher_id, student_id) {
	let inserted = await SQL('insert into trial(teacher_id, student_id) values (?,?)', [teacher_id, student_id]);

	if (inserted.affectedRows > 0)  return inserted.insertId;
	else                            return false;
}

exports.getStudentInfo = async function(id) {
	return (await SQL('select * from student where student_id = ?', id))[0];
}

exports.getTeacherInfo = async function(id) {
	return (await SQL('select * from teacher where teacher_id = ?', id))[0];
} 

exports.getStudentLevel = async function(id) {
	return (await SQL('select lvl from student where student_id = ?', id))[0].lvl;
} 

exports.updateStudentLevel = async function(id){
	let updated = await SQL('update student set lvl = 1 where student_id = ?', id);
	if (updated.affectedRows > 0)   return true;
	else                            return false;
} 

exports.checkTrial = async function(id) {
	let res = await SQL('select * from trial where student_id = ?', id)
	if(res.length > 0)  return true
	else                return false
}

exports.openQuick = async function(id, group) {
	return (await SQL('update student set stream = 1, group_id = ? where student_id = ?', [group, id]))
	.affectedRows > 0? true: false
}

exports.createQuickLesson = async function(group, start, finish) {
	return (await SQL('insert into chart( group_id, start, finish, lesson) values (?, ?, ?, 1)', [group, start, finish]))
	.affectedRows > 0? true: false
}

exports.createQuickGroup = async function(teacher, name) {
	let res = await SQL('insert into gr(teacher_id, group_name, group_type, rate_id) values(?, ?, 1, 1)', [teacher, name]);
	if(res.affectedRows>0) return res.insertId
	else return false
}

exports.acceptToRequest = async function(id) {
	let group = (await SQL('select group_id from student where student_id = ?', id))[0].group_id;
	if(group != 0) return false;

	let req = await SQL('select * from req where student_id = ?', id);
	if(req.length > 0) return false;

	return true; 
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

exports.getConfig = async function() {
	return (await SQL('select * from config'))[0]
}

exports.createPayment = async function(transaction, amount, currency, invoiceId, ip, status, code, message, name, student) {
	return (await SQL('insert into payment(transaction, amount, currency, invoiceId, ip, status, code, message, name, student) values (?,?,?,?,?,?,?,?,?,?,?,?,?)', 
		[transaction, amount, currency, invoiceId, ip, status, code, message, name, student])).affectedRows > 0
}

exports.invoiceIsOk = async function(invoiceId) {
	return (await SQL('select * from payment where invoiceId = ?', invoiceId)).length == 0
}