let SQL = require('../modules/query');

exports.getTestsByTeacherId = async function(teacher_id)
{
	return await SQL(`	select test_id, test_name, lvl_id, lvl_name, dt
						from test
						join lvl on lvl_id = test_lvl
						where  teacher_id = ? order by dt desc`, teacher_id);
}

exports.getTestByTestId = async function(test_id)
{
	return await SQL(`	select test_id, test_name, lvl_id, lvl_name, dt
						from test
						join lvl on lvl_id = test_lvl
						where  test_id = ?`, test_id);
}

exports.getQuestionsByTestId = async function(test_id)
{
	return await SQL(`	select * from question where test_id = ?`, test_id);
}
 
exports.deleteQuestionByTestId = async function(test_id) 
{
	let res = await SQL(`delete from question where test_id = ?`, test_id);

	if(res.affectedRows > 0) 		return true;
	else 							return false;
}
 
exports.updateTest = async function(test_name, teacher_id, test_lvl, test_id) 
{
	let res = await SQL(`update test set test_name = ?, teacher_id = ?, test_lvl = ? where test_id = ?`, 
						[test_name, teacher_id, test_lvl, test_id]);

	if(res.affectedRows > 0) 		return true;
	else 							return false;
}

exports.createTest = async function(test_name, teacher_id, test_lvl) 
{
	let res = await SQL(`insert into test(test_name, teacher_id, test_lvl) values (?,?,?)`, 
						[test_name, teacher_id, test_lvl]);

	if(res.affectedRows > 0) 		return res.insertId;
	else 							return false;
}

exports.createQuestion = async function(test_id, quest_title, variants, correct, weight) 
{
	let res = await SQL(`insert into question(test_id, quest_title, variants, correct, weight) values (?,?,?,?,?)`, 
						[test_id, quest_title, variants, correct, weight]);

	if(res.affectedRows > 0) 		return res.insertId;
	else 							return false;
}

exports.deleteTest = async function(test_id) 
{
	let res = await SQL(`delete from test where test_id = ?`, test_id);

	if(res.affectedRows > 0) 		return true;
	else 							return false;
}

exports.getTeacher = async function(id)
{
	return (await SQL('select * from teacher where teacher_id = ?', id))[0];
}

exports.getLevel = async function(id)
{
	return (await SQL('select * from lvl where lvl_id = ?', id))[0];
}