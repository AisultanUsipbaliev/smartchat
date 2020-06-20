let axios = require('axios')

let proggers = [{ id: 537908946, name: 'Anvar' }, { id:461238130, name: 'Aisultan' }] 

module.exports = async (req, res) => {

	for(i=0; i<proggers.length; i++)
		await axios.post('https://api.telegram.org/bot737103729:AAEzrT-lpwFhqMuXG6IiVAOiDmDBgVPmeqM/sendMessage', {
			chat_id: proggers[i].id,
			text: `${config.production?'PRODUCTION':'DEVELOPMENT'} |  ${JSON.stringify(req.body)}`
		})
	res.sendStatus(200)
}
