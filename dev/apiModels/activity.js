let SQL = require('../apiFunctions/query')

// select
	exports.get = async (userId, isteacher, groupId) => {
		return (await SQL('select * from userActivity where user = ? and isteacher = ? and group_id = ?', [userId, isteacher, groupId]))
	}
// insert
	exports.add = async (userId, start, finish, isteacher, groupId) => {
		return (await SQL('insert into userActivity(user, start, finish, isteacher, group_id) values (?,?,?,?, ?)', [userId, start, finish, isteacher, groupId])).affectedRows
	}
// update

// delete
	exports.delete = async (id) => {
		return (await SQL('delete from userActivity where id = ?', [id])).affectedRows
	}
	exports.remove = async (userId, isteacher, time) => {
		return (await SQL('delete from userActivity where user = ? and isteacher = ? and start < ? and finish > ?', [userId, isteacher, time, time])).affectedRows
	} 