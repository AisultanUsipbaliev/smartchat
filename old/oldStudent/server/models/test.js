const SQL = require('../database/query');
 
exports.getTests = async function(id)
{
	return await SQL(`
		select t.test_id, t.test_name, t.teacher_id, l.lvl_id, l.lvl_name, r.count, r.isread, r.dt, r.answers
		from test t
		join lvl l on l.lvl_id = t.test_lvl
		left join result r on r.test_id = t.test_id
		where r.student_id = ?`, id);
}
 
exports.getTest = async function(test_id)
{
	return await SQL('select * from question where test_id = ?', test_id);
}

exports.getMyTest = async function(id, test) {
	return (await SQL('select * from result where student_id =? and test_id = ?' , [id, test]))[0];
}

exports.getCorrectAndAnswer = async function(student_id, test_id)
{
	return await SQL('select count, answers from result where student_id = ? and test_id = ?', [student_id, test_id]);
}
 
exports.getNameTest = async function(test_id)
{
	return (await SQL('select * from test where test_id =? ', test_id))[0].test_name;
}

exports.updateResult = async function(id, test, count, answers)
{
	let res = await SQL('update result set count = ?, answers = ?, dt = now(), done=1 where student_id = ? and test_id = ?', [count, answers, id, test]);
	if(res.affectedRows > 0) 	return true;
	else						return false;
}

exports.getResult = async function(id, test_id)
{
	return (await SQL('select * from result where student_id = ? and test_id = ?', [id, test_id]))[0];
}

exports.getStudentAgeBySudentId = async function(student_id)
{
	return (await SQL(`SELECT age FROM student WHERE student.student_id = ?`, [student_id]))[0].age;
}
 
exports.getLevelTest = async function(index)
{
	return await SQL('select id, question, title, variants, audio from test_level where id>? limit 10', [index]);
}

exports.getLevelTestAnswers = async function(index)
{
	return await SQL('select id, correct from test_level where id>? limit 10', [index]);
}

exports.updateLevel = async function(id, level)
{
	let res = await SQL('update student set lvl = ? where student_id = ?', [level, id]);
	if(res.affectedRows > 0) 	return true;
	else						return false;
}

exports.getLevelName = async function(id)
{
	return (await SQL('select * from lvl where lvl_id =?', id))[0].lvl_name;
}