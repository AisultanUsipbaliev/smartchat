const SQL = require('../database/query');

exports.acceptToRequest = async function(id) {
	let group = (await SQL('select group_id from student where student_id = ?', id))[0].group_id;
	if(group != 0) return false;

	let req = await SQL('select * from req where student_id = ?', id);
	if(req.length > 0) return false;

	return true; 
}
exports.getUserRateFromReq = async function(student_id) {
	let rate = (await SQL('select * from req where student_id = ? limit 1', student_id))[0];
	if(rate)	return rate.rate_id; 
	else 		return null;
}

exports.getCoursesInfo = async function(id)  {
	if(id) 	return (await SQL('select * from rate where rate_id = ? and active = 1', id))[0];
	else 	return await SQL(`SELECT * FROM rate where active = 1`);
}

exports.getMyLevel = async function(id) {
	return (await SQL('select lvl from student where student_id = ?', id))[0].lvl;
}

exports.checkNeedRequest = async function(id) {
	let res = (await SQL(`select student_id as id from student 
			where student_id in (select student_id from req where student_id = ?) 
			or student_id in (select student_id from trial where student_id = ?)
			or student_id in (select student_id from student where group_id > 0 and student_id = ?)`, [id,id,id]));
	return res.length > 0? res[0].id : false;			
}

exports.addLevel = async function(id) {
	let res = await SQL('update student set lvl = 1 where student_id = ?', [id]);
	return res.affectedRows > 0 ? true : false;
}

exports.getDeal = async function(student) {
	return (await SQL('select * from amocrm where student = ?', student))[0]
}