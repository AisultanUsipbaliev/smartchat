let axios = require('axios');
let config = require('../config/config');

module.exports = function(bot, object)
{
	axios.post(bot, object);
	console.log('Отправка боту сообщения!   ' + 'body = ' , object );
}
