const SQL = require('../functions/query');

exports.getPassword = async () =>
{
	return (await SQL('select pass from config'))[0].pass;
}
exports.getConfig = async () =>
{
	return (await SQL('select id, login, students, min_students, groups, quickTeacher, defaultCost, trialDefaultCost, goodTrial from config'))[0];
}
exports.getSelectedTeacher = async () =>
{
	return await SQL(`select t.teacher_id, concat(t.login, ' ', t.lastname) as fio, count(g.group_id) as group_count 
										from teacher t
										left join gr g on g.teacher_id = t.teacher_id
										where t.blocked = 0
										group by t.teacher_id;`);
}
exports.changePass = async (pass) =>
{
	let res = await SQL('update config set pass = ? where id = 1', pass);
}
exports.updateConfig = async (login, students, min_students, groups, quickTeacher, defaultCost, trialDefaultCost, goodTrial) =>
{
	return (await SQL('update config set login = ?, students = ?, min_students = ?, groups = ?, quickTeacher = ?, defaultCost = ?, trialDefaultCost = ?, goodTrial = ? where id = 1', 
										[login, students, min_students, groups, quickTeacher, defaultCost, trialDefaultCost, goodTrial])).affectedRows > 0 ? true: false;
}