let SQL = require('../apiFunctions/query')

// select 
	
// insert
	exports.add = async (isteacher, user, ip, agent) => {
		return (await SQL('insert into ingress(isteacher, user, ip, agent) values (?, ?, ?, ?)', [isteacher, user, ip, agent])).affectedRows
	}
// update

// delete