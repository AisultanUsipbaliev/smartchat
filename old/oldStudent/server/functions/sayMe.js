let axios = require('axios')
let push = require('./pushing')

module.exports = async function(route, err) {
	await axios.post('https://api.telegram.org/bot737103729:AAEzrT-lpwFhqMuXG6IiVAOiDmDBgVPmeqM/sendMessage', {
		chat_id: 537908946,
		text: `PRODUCTION: ${config.production}\nSTUDENT  ${config.port} | ${route} |\n${err}`
	})
}