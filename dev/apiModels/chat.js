let SQL = require('../apiFunctions/query')

// select 	
	exports.getMessage = async (id) => {
		return (await SQL('select * from chat where mes_id = ?', [id]))[0]
	}
	exports.getUndelivered = async (groupId) => {
		return await SQL('select * from chat where group_id = ? and delivered = false', [groupId])
	}
	exports.findFile = async (file) => {
		return await SQL('select * from chat where content = ?', [file])
	}
	exports.getUsers = async (groupId)=>{
		let users = []
		let prepod = (await SQL('select teacher_id id from gr where group_id = ?', [groupId]))[0].id
		users.push({id: prepod, isteacher: 1})
		let students = await SQL('select student_id id from student where group_id = ?', [groupId])
		for(let i = 0; i<students.length; i++) users.push({id: students[i].id, isteacher: 0 })
		return users
	}
	exports.getConfines = async (groupId) => {
		return (await SQL('select min(dt) as start, max(dt) as finish from chat where group_id = ?', [groupId]))[0]
	}
	exports.getAll = async (groupId) => {
		return (await SQL(`
			SELECT
				c.mes_id,
				c.group_id,
				c.sender_id,
				c.dt,
				c.content,
				c.title,
				c.type,
				c.isteacher,
				c.reference, 
				IF(c.isteacher = 1, concat(t.login, ' ', t.lastname), concat(s.firstname,' ', s.lastname)) sender_name,
				IF(c.isteacher = 1, t.ava, s.ava) ava,
				rc.title refTitle,
				rc.type refType,
				rc.content refContent,
				IF(rc.isteacher = 1, concat(rt.login, ' ', rt.lastname), concat(rs.firstname,' ', rs.lastname)) refSender
			FROM 
				chat c
			LEFT JOIN 
				chat rc 
			ON 
				c.reference = rc.mes_id
			LEFT JOIN 
				student s
			ON 
				c.sender_id = s.student_id
			LEFT JOIN 
				teacher t 
			ON 
				c.sender_id = t.teacher_id
			LEFT JOIN 
				student rs 
			ON 
				rc.sender_id = rs.student_id
			LEFT JOIN 
				teacher rt 
			ON 
				rc.sender_id = rt.teacher_id 
			WHERE 
				c.group_id = ? 
			ORDER BY
				c.dt
			`, 
			[
				groupId
			]))
	}
	exports.getStudentChat = async (groupId, studentId) => {
		return await SQL(`  select c.mes_id, c.group_id, c.sender_id, c.dt, c.content, c.type, c.isteacher, c.title, c.delivered, c.reference,
							IF(c.isteacher = 1, concat(t.login, ' ', t.lastname), concat(s.firstname,' ', s.lastname)) as sender_name, 
							IF(c.isteacher = 1, t.ava, s.ava) as ava,
							ch.content refContent, ch.title refTitle, ch.type refType,
							IF(ch.isteacher = 1, concat(tc.login, ' ', tc.lastname), st.firstname) as refSender,
							c.isread
							from chat c 
							left join student s on s.student_id = c.sender_id
							left join teacher t on t.teacher_id = c.sender_id
							left join chat ch on ch.mes_id = c.reference
							left join student st on st.student_id = ch.sender_id
							left join teacher tc on tc.teacher_id = ch.sender_id
							where c.group_id = ?
							and ((c.delivered = 0 and c.sender_id = ?)
							or c.delivered = 1)
							order by c.dt desc
							limit 30`, [groupId, studentId])
	}
	exports.getStudentPartChat = async (groupId, studentId, mesId) => {
		return await SQL(`  select c.mes_id, c.group_id, c.sender_id, c.dt, c.content, c.type, c.isteacher, c.title, c.delivered, c.reference,
							IF(c.isteacher = 1, concat(t.login, ' ', t.lastname), concat(s.firstname,' ', s.lastname)) as sender_name, 
							IF(c.isteacher = 1, t.ava, s.ava) as ava,
							ch.content refContent, ch.title refTitle, ch.type refType,
							IF(ch.isteacher = 1, concat(tc.login, ' ', tc.lastname), st.firstname) as refSender,
							c.isread
							from chat c 
							left join student s on s.student_id = c.sender_id
							left join teacher t on t.teacher_id = c.sender_id
							left join chat ch on ch.mes_id = c.reference
							left join student st on st.student_id = ch.sender_id
							left join teacher tc on tc.teacher_id = ch.sender_id
							where c.group_id = ?
							and c.mes_id < ?
							and ((c.delivered = 0 and c.sender_id = ?)
							or c.delivered = 1)
							order by c.dt desc limit 10`, [groupId, mesId, studentId]);
	}
	exports.getTeacherChat = async (groupId) => {
		return await SQL(`
			select c.mes_id, c.group_id, c.sender_id, c.dt, c.content, c.title, c.type, c.isteacher, c.reference, 
			!(select count(*) from unread where mes_id = c.mes_id) as isread,
			if(c.isteacher = 1, concat(t.login, ' ', t.lastname), concat(s.firstname,' ', s.lastname)) as sender_name,
			if(c.isteacher = 1, t.ava, s.ava) as ava,
			rc.title refTitle, rc.type refType, rc.content refContent,
			if(rc.isteacher = 1, concat(rt.login, ' ', rt.lastname), concat(rs.firstname,' ', rs.lastname)) as refSender
			from chat c
			left join chat rc on c.reference = rc.mes_id
			left join student s on c.sender_id = s.student_id
			left join teacher t on c.sender_id = t.teacher_id
			left join student rs on rc.sender_id = rs.student_id
			left join teacher rt on rc.sender_id = rt.teacher_id
			where c.delivered = 1
			and c.group_id = ? 
			order by c.dt desc 
			limit 30`, [groupId])
	} 
	exports.getTeacherUnreadMesCount = async (groupId) => {
		return (await SQL(` select count(*) as cnt from chat 
							where delivered = 1 
							and isread = 0
							and isteacher = 0
							and group_id = ?`, [groupId]))[0].cnt
	} 
	exports.getTeacherPartChat = async (groupId, mesId) => {
		return await SQL(`
			select c.mes_id, c.group_id, c.sender_id, c.dt, c.content, c.title, c.type, c.isteacher, c.reference, 
			!(select count(*) from unread where mes_id = c.mes_id) as isread,
			if(c.isteacher = 1, concat(t.login, ' ', t.lastname), concat(s.firstname,' ', s.lastname)) as sender_name,
			if(c.isteacher = 1, t.ava, s.ava) as ava,
			rc.title refTitle, rc.type refType, rc.content refContent,
			if(rc.isteacher = 1, concat(rt.login, ' ', rt.lastname), concat(rs.firstname,' ', rs.lastname)) as refSender
			from chat c
			left join chat rc on c.reference = rc.mes_id
			left join student s on c.sender_id = s.student_id
			left join teacher t on c.sender_id = t.teacher_id
			left join student rs on rc.sender_id = rs.student_id
			left join teacher rt on rc.sender_id = rt.teacher_id
			where c.delivered = 1
			and c.group_id = ? 
			and c.mes_id < ?
			order by c.dt desc 
			limit 30`,
			[groupId, mesId])
	}
	exports.findStudentMessages = async (text, groupId, senderId) => {
		return (await SQL(`
			select * from chat 
			where group_id = ? 
			and ((delivered = 0 and sender_id = ?) or delivered = 1)
			and (type = 1 and content like ?) 
			or (type > 1 and title like ?) 
			order by mes_id desc`, [groupId, senderId, text, text]))
	}
	exports.findTeacherMessages = async (groupId, text) => {
		return await SQL(`
			select c.mes_id, c.group_id, c.sender_id, c.dt, c.content, c.title, c.type, c.isteacher, c.reference, 
			!(select count(*) from unread where mes_id = c.mes_id) as isread,
			if(c.isteacher = 1, concat(t.login, ' ', t.lastname), concat(s.firstname,' ', s.lastname)) as sender_name,
			if(c.isteacher = 1, t.ava, s.ava) as ava,
			rc.title refTitle, rc.type refType, rc.content refContent,
			if(rc.isteacher = 1, concat(rt.login, ' ', rt.lastname), concat(rs.firstname,' ', rs.lastname)) as refSender
			from chat c
			left join chat rc on c.reference = rc.mes_id
			left join student s on c.sender_id = s.student_id
			left join teacher t on c.sender_id = t.teacher_id
			left join student rs on rc.sender_id = rs.student_id
			left join teacher rt on rc.sender_id = rt.teacher_id
			where c.delivered = 1
			and c.group_id = ?
			and c.content like concat('%', ?,'%') 
			order by c.dt desc`,
			[groupId, text])
	}
	
// update
	exports.setIsRead = async (group_id) => {
		return (await SQL('update chat set isread = 1 where group_id = ?', [group_id])).affectedRows
	}
	exports.setDelivered = async (group_id) => {
		return (await SQL('update chat set delivered = 1 where group_id = ?', [group_id])).affectedRows
	}
// delete

// insert
	exports.addMessage = async (data) => {
		let inserted = await SQL('insert into chat(group_id, sender_id, content, type, isteacher, title, delivered, reference) values(?,?,?,?,?,?,?,?)', 
			[data.group_id, data.sender, data.content, data.type, data.isteacher, data.title, data.delivered, data.reference])
		return inserted.insertId
	}