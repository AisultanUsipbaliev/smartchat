let SQL = require('../modules/query');

exports.getResultByTeacherId = async function(teacher_id)
{
	return await SQL(`	select s.student_id, s.firstname, s.lastname, t.test_name, t.test_id, l.lvl_name, r.count, 
						r.dt, r.result_id, r.answers
						from result r
						join student s on s.student_id = r.student_id
						join test t on t.test_id = r.test_id
						join lvl l on l.lvl_id = t.test_lvl
						where t.teacher_id = ?`, teacher_id);
} 

exports.setIsreadResult = async function(result_id) 
{
	let res = await SQL('update .result set isread = 1 where result_id=?', result_id);

	if(res.affectedRows > 0) 	return true;
	else 						return false;
}

exports.getStudentIdByGroupId = async function(group_id)
{
	return await SQL(`	select s.student_id from student s where s.group_id = ?`, group_id);
} 

exports.createResult = async function(student_id, test) 
{
	let res = await SQL('insert into result(student_id, test_id) values (?, ?)', [student_id, test]);

	if(res.affectedRows > 0) 	return true;
	else 						return false;
}

exports.createHomework = async function(student_id, template) 
{
	let res = await SQL('insert into homework(student, template) values (?, ?)', [student_id, template]);

	if(res.affectedRows > 0) 	return true;
	else 						return false;
}


exports.getHomework = async function(teacher_id) 
{
	return await SQL(` 	select s.student_id, s.firstname, s.lastname, h.checked, h.score, h.filePath, h.dt, h.id
						from student s
						join homework h on h.student = s.student_id
						join gr g on s.group_id = g.group_id
						where g.teacher_id = ?
						order by h.dt desc`, [teacher_id]);
}

exports.createHomeworkResult = async function(id, score) 
{
	let updated = await SQL('update homework set score = ? where id = ?', [score, id]);
	if(updated.affectedRows > 0) 	return true;
	else 							return false;
}

exports.getTest = async function(test_id)
{
	return await SQL('select * from question where test_id = ?', test_id);
}

exports.getNameTest = async function(test_id)
{
	return (await SQL('select * from test where test_id =? ', test_id))[0].test_name;
}

exports.getResultTest = async function(id, test_id)
{
	return (await SQL('select * from result where student_id = ? and test_id = ?', [id, test_id]))[0];
}    
