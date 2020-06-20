let SQL = require('../apiFunctions/query')

// Select
	exports.getList = async () => {
		return (await SQL('select * from teacher where checkMe = 1'))
	}
	exports.getProfile = async (id) => {
		return (await SQL(`	select t.teacher_id, t.login, t.lastname, t.phone, t.email, l.lvl_id, l.lvl_name, 
			t.ava, t.les_count, if(t.role, 'Старший преподаватель', 'Младший пеподаватель') as role_name, 
			t.role, t.activated, t.is_active, round(t.rating, 2) as rating, t.smsOn, t.mailOn, t.blocked, t.regDate, t.lastVisit,
			sum(b.amount) as amount, b.currency
			from teacher t
			left join lvl l on l.lvl_id = t.lvl
			left join balance b on b.teacher = t.teacher_id
			where t.teacher_id = ?`, [id]))[0]
	}

	exports.authorize = async (email, password) => {
		return (await SQL('select * from teacher where email = ? and pass = ? ', [email, password]))
	}

	exports.findPhone = async (phone) => {
		return (await SQL('select * from teacher where phone = ?', [phone]))[0]
	}

	exports.findEmail = async (email) => {
		return (await SQL('select * from teacher where email = ?', [email]))[0]
	}


	exports.getTeacher = async (id)=>{
		return (await SQL('select * from teacher where teacher_id = ?', [id]))[0]
	}
	exports.getTeachers = async () => {
		return await SQL(`SELECT t.teacher_id, t.login, t.lastname, t.phone, t.email, t.lvl, t.ava, t.les_count, 
						(SELECT SUM( r.value)/COUNT(r.value) FROM rating r WHERE r.teacher_id = t.teacher_id) AS rating
						FROM teacher t
						where t.blocked = 0`)
	} 
	exports.getSelectedTeacher = async () => {
		return await SQL(`select t.teacher_id, concat(t.login, ' ', t.lastname) as fio, count(g.group_id) as group_count 
											from teacher t
											left join gr g on g.teacher_id = t.teacher_id
											where t.blocked = 0
											group by t.teacher_id;`);
	}
	exports.findGroup = async (groupId) =>{
		return (await SQL('select * from teacher t join gr g on g.teacher_id = t.teacher_id where g.group_id = ?', groupId))[0]
	}
	exports.check = async (email, pass) => {
		return (await SQL('select * from teacher where (phone = ? or email =? ) and pass = ?', [email, email, pass]))[0]
	}
	exports.findAva = async (ava) => {
		return await SQL('select * from teacher where ava = ?', [ava])
	}
	exports.findFile = async (file) => {
		return await SQL(`select * from teacher where resume = ? or audioResume = ?`, [file, file])
	}
	exports.getVisitHistory = async (teacher_id, order, from, to) => {
		return await SQL(`	select agent, ip, date_format(dt,'%H:%i %d.%m.%Y') as dt
							from ingress i
							join teacher t on i.user = t.teacher_id
							where user = ? and isteacher = 0
							order by dt ${order} limit ?, ?;`, [teacher_id, from, to]);
	}
// Update
	exports.setChecked = async (id) => {
		return (await SQL('update teacher set checkMe = 0 where teacher_id = ?', [id])).affectedRows
	}
	exports.increaseLesCount = async (id) => {
		return (await SQL(`update teacher set les_count = les_count + 1  where teacher_id = ?`, [id])).affectedRows
	}
	exports.updateSmsCode = async (id, code) => {
		return (await SQL('update teacher set smsCode = ? where teacher_id = ?', [code, id])).affectedRows
	}
	exports.updateEmailCode	= async (id, emailCode) => {
		return (await SQL('update teacher set emailCode = ? where teacher_id = ?', [emailCode, id])).affectedRows
	}

	exports.activatePhone = async (id) => {
		return (await SQL('update teacher set is_active = 1 where teacher_id = ?', [id])).affectedRows
	}

	exports.updateIsActive = async (id, value) => {
		return (await SQL('update teacher set is_active = ? where teacher_id = ?', [value, id])).affectedRows
	}
	exports.updateActivated = async (id, value) => {
		return (await SQL('update teacher set activated = ? where teacher_id = ?', [value, id])).affectedRows
	}

	exports.activateEmail = async (emailCode) => {
		return (await SQL('update teacher set activated = 1 where emailCode = ?', [emailCode])).affectedRows
	}

	exports.updatePassword = async (id, pass) => {
		return (await SQL('update teacher set pass = ? where teacher_id = ?', [pass, id])).affectedRows 
	}

	exports.updateBlock = async function(id, block) {
		return (await SQL('update teacher set blocked = ? where teacher_id = ?', [block, id])).affectedRows
	}

	exports.updateSMSOn = async function(id, stat) {
		return (await SQL('update teacher set smsOn = ? where teacher_id = ?', [stat, id])).affectedRows
	}
	exports.updateMailOn = async function(id, stat) {
		return (await SQL('update teacher set mailOn = ? where teacher_id = ?', [stat, id])).affectedRows
	}


	exports.updateTeacher = async (id, login, lastname) => {
		return (await SQL('update teacher set login = ?, lastname = ? where teacher_id = ?', [login, lastname, id])).affectedRows
	}

	exports.updateLevel = async(id, level) => {
		return (await SQL('update teacher set lvl = ? where teacher_id = ?', [level, id])).affectedRows
	}

	exports.updateAva = async (fileName, id) => {
		return (await SQL('update teacher set ava = ? where teacher_id = ?', [fileName, id])).affectedRows 
	}
	
// Insert
	exports.add = async function(phone, email, pass, login, lastname) {
		return await SQL('insert into teacher (phone, email, pass, login, lastname) values (?,?,?,?,?)', [phone, email, pass, login, lastname])
	}
	exports.addTeacher = async (login, lastname, email, phone, password) => {
		return (await SQL('insert into teacher (login, lastname, email, phone, pass) values (?,?,?,?,?)', [login, lastname, email, phone, password])).insertId
	}
	exports.newTeacher = async (login, lastname, email, phone, password, resume, testResult, audioResume) => {
		return (await SQL('insert into teacher (login, lastname, email, phone, pass, resume, testResult, audioResume, checkMe) values (?,?,?,?,?,?,?,?,1)', 
			[login, lastname, email, phone, password, resume, testResult, audioResume])).insertId
	}
// Delete 

	exports.deleteTeacher = async (teacherId) => {
		return (await SQL('delete from teacher where teacher_id = ?', teacherId)).affectedRows
	}



// admin -------------------------------------------------------------------------------------------------------------------------------

exports.getTeachers2 = async (column, order, from, limit, text) => {
	return await SQL(`	select t.teacher_id, t.phone, concat(login, ' ', lastname) as fio, round(avg(r.value), '2') as rating, email, blocked from teacher t
						left join rating r on r.teacher_id = t.teacher_id
						where (
							role like concat('%', ? ,'%')
							or concat(login, ' ', lastname) like concat('%', ? ,'%')
							or email like concat('%', ? ,'%')
						)
						group by t.teacher_id
						order by ? ${order} limit ?, ?`, [text, text, text, column, from, limit]);
} 

exports.getFilteredTeachers = async (filter, column, order, from, limit, text) => {
	return await SQL(`	select t.teacher_id, t.phone, concat(login, ' ', lastname) as fio, round(avg(r.value), '2') as rating, email, blocked from teacher t
						left join rating r on r.teacher_id = t.teacher_id 
						where blocked = ?
						and (
							role like concat('%', ? ,'%')
							or concat(login, ' ', lastname) like concat('%', ? ,'%')
							or email like concat('%', ? ,'%')
						)
						group by t.teacher_id 
						order by ? ${order} limit ?, ?`, [filter, text, text, text, column, from, limit]);
} 
exports.getTeacherGroupList = async (teacher_id) =>
{
	return await SQL(`	select r.rate_id, r.rate_name, g.group_id, g.group_name, c.chart_id, c.start, c.finish, c.lesson, r.lessons, null as editing, null as loading, null as temp_lesson, null as temp_start_day, null as temp_finish_day, null as temp_start_time, null as temp_finish_time
						from teacher t
						left join gr g on g.teacher_id = t.teacher_id
						join chart c on c.group_id = g.group_id
						join rate r on r.rate_id = g.rate_id
						where t.teacher_id = ?;`, [teacher_id]);
}
exports.getTeacherBalance = async (teacher_id) =>
{
	return await SQL(`select b.amount, b.currency, b.comment, b.dt
					  from balance b
					  where teacher = ?`,[teacher_id]);
}


