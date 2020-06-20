let SQL = require('../apiFunctions/query')

// select 
	exports.find = async (score) => {
		return (await SQL('select * from rank where value > ?', [score]))[0]
	}
	exports.getPrev = async (score) => {
		return (await SQL('select * from rank where value < ? order by id desc', [score]))[0]
	}