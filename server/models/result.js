let SQL = require('../database/query');

exports.Result = async function(data)
{
	return await SQL(`
					select s.firstname, s.lastname, t.name, t.id, l.name, r.count, r.dt, r.id
					from student s, test t, level l, result r 
					where s.id = r.student 
					and t.id = r.test 
					and l.id = t.level 
					and t.teacher = ?`, 
					[data.index]);
}
exports.IsRead = async function(data)
{
    return await SQL('update result set isread = 1 where id=?', [data.result]);
}


 