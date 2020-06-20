module.exports = async function(ws) {
	try {
		
		if(!ws.userid) return

		let id 			= ws.userid.substr(1)
		let isteacher 	= ws.userid[0] == 't'

		socket.clients.forEach( ws => {
			try {
				ws.send( JSON.stringify( { id, isteacher, status: 0, notice: 6 } ) ) 
			} catch(err) {
				//nothing to do
			}
		})
	
	} catch(err) {
		await sayMe('Socket::clientDisconnect', {}, err.message)
	}
}