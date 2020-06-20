let mysql = require('mysql2/promise')

module.exports = async function(query, data) {
	let con = await mysql.createConnection(config.database)
	try {
		if(data || data == 0) {

			let [result] = await con.query(query, data)
			return result
			
		} else {

			let [result] = await con.query(query)
			return result
			
		}
	} catch(err) {
		sayMe('mysql error', {query, data}, err.message)
		console.log('SQL::ERROR:: ' + query + '[ ' + JSON.stringify(data? data:{}) + ']', err)
		return false
	} finally {
		con.end()
	}
}