let SQL = require('../functions/query')

// Select

// Update

// Insert
	exports.add = async (teacher, amount, comment) => {
		return (await SQL('insert into balance(teacher, amount, comment) values (?,?,?)', [teacher, amount, comment]))
	}
// Delete