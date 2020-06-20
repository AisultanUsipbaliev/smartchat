let SQL = require('../apiFunctions/query')

// Select
	exports.findFile = async (file) => {
		return await SQL('select * from report where file = ?', [file])
	}
// Update

// Insert
	exports.addReport = async (id, comment, file) => {
		if(file) return (await SQL('insert into report(user, com, file) values(?,?,?)', [id, comment, file])).affectedRows
		else return (await SQL('insert into report(user, com) values(?,?)', [id, comment])).affectedRows
	}
	
// Delete
