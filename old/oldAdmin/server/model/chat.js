let SQL = require('../functions/query');

// Выборка
	exports.getChat = async function(group_id, student_id) {
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
							limit 30`, [group_id, student_id]);
	}

	exports.getPartChat = async function(group_id, student_id, mes_id) {
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
							order by c.dt desc limit 10`, [group_id, mes_id, student_id]);
	}
	exports.getUnreadCount = async function(myId) {
		return (await SQL(`
		select count(*) cnt from unread u
		join chat c on c.mes_id = u.mes_id
		join student s on s.student_id = u.user_id and s.group_id = c.group_id
		where u.user_id = ?`, myId))[0].cnt
	}
	exports.searchMessages = async function(text, group_id, sender_id) {
		// херовый запрос потом исправлю)))
		console.log('text', text)
		console.log('group_id', group_id)
		console.log('sender_id', sender_id)
		return (await SQL(`
		select mes_id from chat 
		where group_id = ? 
		and ((delivered = 0 and sender_id = ?) or delivered = 1)
		and (type = 1 and content like '%${text}%') 
		or (type > 1 and title like '%${text}%') 
		order by mes_id desc`, [group_id, sender_id]))
	}

// Вставка

// Изменение

// Удаление