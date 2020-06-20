let SQL = require('../apiFunctions/query')

// Select
	exports.getCount = async function(studentId) {
		return (await SQL(`
		select count(*) cnt from unread u
		join chat c on c.mes_id = u.mes_id
		join student s on s.student_id = u.user_id and s.group_id = c.group_id
		where u.user_id = ?`, [studentId]))[0].cnt
	}
// Update

// Insert
	exports.add = async (mes_id, user) => {
		return (await SQL('insert into unread(mes_id, user_id) values (?,?)', [mes_id, user])).affectedRows
	}
// Delete
	exports.delete = async (studentId) => {
		return (await SQL('delete from unread where user_id = ?', [studentId])).affectedRows
	}