let SQL = require('./query')
let axios 	= require('axios')

module.exports = async function(action, isteacher, danger) {

	let chats = [-226248107, -268478418]

	if(config.production) 
		for(i=0; i<chats.length; i++)
			await axios.post('https://api.telegram.org/bot737103729:AAEzrT-lpwFhqMuXG6IiVAOiDmDBgVPmeqM/sendMessage', {
				chat_id: chats[i],
				text: action
			})

	if(!danger) danger = false

	return (await SQL('insert into log(act, danger, isteacher) values (?, ?, ?)', [action, danger, isteacher])).affectedRows
}