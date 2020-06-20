let SQL = require('../functions/query')

// Select
	exports.getPrice = async (teacher, rate) => {
		return (await SQL('select * from price where teacher = ? and rate = ? ', [teacher, rate]))[0]
	}
// Update

// Insert

// Delete