const axios = require('axios');
const cyrillicToTranslit = require('cyrillic-to-translit-js');

module.exports = async function(to, text) 
{
	if (config.production) {
		let translitText = cyrillicToTranslit().transform(text);
		let mobizon = `https://api.mobizon.kz/service/Message/SendSmsMessage?apiKey=${config.mobizonApiKey}&output=json&recipient=${to.substr(1)}&text=SmartChat%0A${translitText}`;
		return await axios.get(mobizon);
	} else { return true }
}