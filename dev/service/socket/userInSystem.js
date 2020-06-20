let SQL = require('../../apiFunctions/query')

module.exports = async function(id, isteacher) {

	let date = new Date()
	let table = isteacher? 'teacher':'student'
	SQL(`update ${table} set lastvisit = ? where ${table}_id = ?`, [date, id])
	
	socket.clients.forEach( ws => ws.send( JSON.stringify( { id, isteacher, status: 1, notice: 6 } ) ) )

}