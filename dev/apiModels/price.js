let SQL = require('../apiFunctions/query')

// Select
	exports.getPrice = async (teacherId, rate) => {
		return (await SQL('select * from price where teacher = ? and rate = ? ', [teacherId, rate]))[0]
	}
// Update

// Insert

// Delete