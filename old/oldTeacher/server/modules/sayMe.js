let axios = require('axios')
let push = require('./pushing')

module.exports = async function(title, content) {

	if(!config.production) {

		await push(['evQzosLnUTw:APA91bFiqwr6g1dlCl81WqXyhWKAjK8mCHt9rMCjeIg_P9GFOi-N_Z7qgkK63IUtc-kyHdAWsIIffIlYd4izQn8_AVMdz_nlAR5ne-MQ2DTxamGDUB0VqIBP1sNhGvQPgpPY_X2Bz7q2'], 
		title + '|'+ config.production+'|' + "", 
		content + "")

	} else { 

		await axios.post('https://api.telegram.org/bot737103729:AAEzrT-lpwFhqMuXG6IiVAOiDmDBgVPmeqM/sendMessage', {
			chat_id: 537908946,
			text: `<teacher>${title}| ${config.production} | ${content}`
		});
		
 	}
}