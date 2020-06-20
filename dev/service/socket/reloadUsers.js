module.exports = ()=>{
	socket.clients.forEach(ws=>{
		ws.send(JSON.stringify({notice: 111}))
	})
}