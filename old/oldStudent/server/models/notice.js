const SQL = require('../database/query');

exports.deleteNotice = async function(id)
{
	let res = await SQL('delete from notice where notice_id = ?', id);
	if(res.affectedRows > 0) 	return true;
	else 						return false;
}

exports.getNotices = async function(id)
{
	return await SQL('select * from notice where isteacher = 0 and user_id = ?', id);
}

exports.getUnreadCount = async function(id)
{
	return (await SQL(`
		select count(*) cnt from unread u
		join chat c on c.mes_id = u.mes_id
		join student s on s.student_id = u.user_id and s.group_id = c.group_id
		where u.user_id = ?`, id))[0].cnt;
}


//Опоздашки
exports.getStudent = async function(id)
{
	return (await SQL('select * from student where student_id = ?', id))[0];
}

exports.getLate = async function(id, now)
{
	return await SQL('select * from late where user_id = ? and hr = ? and isteacher = false', [id, now]);
}
exports.deleteLate = async function(id)
{
	let res = await SQL('delete from late where id = ?', id);
	if(res.affectedRows > 0)	return true;
	else 					 	return false;
}

exports.getHomeworksCount = async function(id)
{
	return (await SQL('select count(*) cnt from homework where student = ? and done = 0', id))[0].cnt;
}

exports.getTestsCount = async function(id)
{
	return (await SQL('select count(*) cnt from result where student_id = ? and done = 0', id))[0].cnt;
}

exports.getNeedFeedback = async function(id)
{
	return await SQL(`
		select nf.teacher, nf.student, concat(t.login,' ',t.lastname) as fio, t.ava
		from needFeedback nf
		left join teacher t on t.teacher_id = nf.teacher
		where nf.student = ? 
		`, id);
}