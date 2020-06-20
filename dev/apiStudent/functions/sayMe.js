let axios = require('axios')
let push = require('./pushing')

module.exports = async function(route, data, err) {
	await axios.post('https://api.telegram.org/bot737103729:AAEzrT-lpwFhqMuXG6IiVAOiDmDBgVPmeqM/sendMessage', {
		chat_id: 537908946,
		text: `${config.production?'PRODUCTION':'DEVELOPMENT'}\nSTUDENT| ${route} |\nDATA: ${JSON.stringify(data)}\n${err}`
	})
}