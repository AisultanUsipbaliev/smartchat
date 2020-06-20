let SQL = require('../apiFunctions/query')

// select 
	exports.getGroup = async function(id) {
		return (await SQL('select * from gr where group_id = ?', [id]))[0]
	}
	exports.getGroups = async function(teacherId) {
		return await SQL(`select g.group_id groupId, s.student_id studentId, if( now() - s.lastVisit < 256, 1, 0 ) status
			from gr g
			left join student s on s.group_id = g.group_id  
			where g.teacher_id = ?`, [teacherId])
	}
	exports.getTeacher = async (id) => {
		return (await SQL('select *, t.login firstname from teacher t join gr g on g.teacher_id = t.teacher_id where g.group_id = ?', [id]))[0]
	}
	exports.getStudent = async (id) => {
		return (await SQL('select * from student where group_id = ?', [id]))[0]
	}
	exports.getRate = async (id) => {
		return (await SQL('select * from rate r join gr g on g.rate_id = r.rate_id where g.group_id = ?', [id]))[0]
	}
	exports.getLevel = async (id) => {
		return (await SQL('select l.lvl_id, l.lvl_name from lvl l join student s on s.lvl = l.lvl_id where s.group_id = ?', [id]))[0]
	}
	exports.getBadGroups = async () => {
		return await SQL('select * from gr where group_id not in (select group_id from chart) and started = 1')
	}
	exports.getTeacherGroup = async (teacherId, id) => {
		return (await SQL('select * from gr where teacher_id = ? and group_id = ?', [teacherId, id]))[0]
	}
	exports.getTeacherGroups = async (teacherId) => {
		return await SQL(`	select g.group_id, g.group_name, g.teacher_id, 
			if(min(start) < (unix_timestamp(now()) * 1000) and (unix_timestamp(now()) * 1000) < min(finish), true, false) islesson
			from gr g
			left join chart c on c.group_id = g.group_id
			where g.teacher_id = ? group by c.group_id`, [teacherId])
	}
	exports.findName = async (teacherId, text) => {
		return await SQL(`select * from gr where teacher_id = ? and group_name like concat('%', ? ,'%')`, [teacherId, text])
	}

// insert
	exports.addGroup = async function(teacherId, name, rateId) {
		let res = await SQL('insert into gr(teacher_id, group_name, group_type, rate_id) values(?, ?, 1, ?)', [teacherId, name, rateId])
		return res.affectedRows>0? res.insertId: false
	}

// update
	exports.setStarted = async (id) => {
		return (await SQL('update gr set started = 1 where group_id = ?', [id])).affectedRows
	}
	exports.updateTeacher = async (group_id, teacher_id) => {
		return (await SQL('update gr set teacher_id = ? where group_id = ?', [teacher_id, group_id])).affectedRows
	}
	exports.updateRate = async (group_id, rate_id) => {
		return (await SQL('update gr set rate_id = ? where group_id = ?', [rate_id, group_id])).affectedRows
	}

// delete
	exports.delete = async (id) => {
		return (await SQL('delete from gr where group_id = ?', [id])).affectedRows
	}