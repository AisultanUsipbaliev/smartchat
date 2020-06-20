var FCM = require('fcm-push')
var fcm = new FCM(config.push.token)

module.exports = async function(to, title, text, url) {
	if(!url) url = 'https://web.smartchat.kz'		

	let message = {
		to,
		collapse_key: config.push.collapse,
		data: { your_custom_data_key: config.push.id },
		notification: {
			title, 
			body: text,
			icon: 'https://web.smartchat.kz/static/img/notify.png',
			click_action: url
		}
	}

	fcm.send(message, function(err, response) {
		if(err) sayMe('push', {to, title, text, url}, 'can\'t send push') 
	})
}