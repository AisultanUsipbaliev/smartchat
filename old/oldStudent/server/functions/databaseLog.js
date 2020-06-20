let SQL = require('../functions/query');
let axios 	= require('axios');

module.exports = async function(action, danger) {

	if(config.production) {
		await axios.post('https://api.telegram.org/bot737103729:AAEzrT-lpwFhqMuXG6IiVAOiDmDBgVPmeqM/sendMessage', {
				chat_id: -226248107,
				text: action
			});

		await axios.post('https://api.telegram.org/bot737103729:AAEzrT-lpwFhqMuXG6IiVAOiDmDBgVPmeqM/sendMessage', {
				chat_id: -268478418,
				text: action
			});
	}
	if(!danger) danger = false;

	let res = await SQL('insert into log(act, danger) values (?, ?)', [action, danger]);
	if(res.affectedRows > 0) 	return true;
	else 						return false;
}