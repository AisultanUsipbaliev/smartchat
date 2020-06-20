let apiKey = 'kzd8ac24577077d98e231bc90a5ef9f21c5802d970beff17369f99f4ef2ffd0c6e437a'

let axios = require('axios')
let qs = require('querystring')

module.exports = async function(to, text){
	if(!config.production) return true
		
	let res = false
	try {	
		to = await qs.escape(to)
		text = await qs.escape('Привет, это Смарти.\n' + text)
		let mobizon = `https://api.mobizon.kz/service/message/sendSmsMessage?apiKey=${apiKey}&api=v1&from=Smartchat&output=json&recipient=${to}&text=${text}`
		res = await axios.post(mobizon)
	
	} catch(err) {
		sayMe('smsApi', {}, err.message)
	}

	return res
}