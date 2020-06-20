let SQL = require('../apiFunctions/query')

// Выборка

exports.getPassword = async () =>
{
	return (await SQL('select pass from config'))[0].pass;
}
exports.getConfig = async () =>
{
	return (await SQL('select *, null as pass from config'))[0];
}

// Вставка

// Удаление

// Изменение 

exports.changePass = async (pass) =>
{
	return (await SQL('update config set pass = ? where id = 1', [pass])).affectedRows
}
exports.updateConfig = async (max_students, min_students, max_groups, quickTeacher, defaultCost, trialDefaultCost, goodTrial) =>
{
	return (await SQL('update config set max_students = ?, min_students = ?, max_groups = ?, quickTeacher = ?, defaultCost = ?, trialDefaultCost = ?, goodTrial = ? where id = 1', 
										[max_students, min_students, max_groups, quickTeacher, defaultCost, trialDefaultCost, goodTrial])).affectedRows
} 


