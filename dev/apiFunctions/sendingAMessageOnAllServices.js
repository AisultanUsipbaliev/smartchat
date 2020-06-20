const sendSms  = require('./smsApi');
const sendMail = require('./mailing');
const sendPush = require('./pushing');

module.exports = async (user, message) => {
	if (user.smsOn && user.phone) 			  { await sendMail(message, user) } 
	if (user.mailOn && user.email) 			  { await sendSms(user.phone, message) } 

	let push = []

	try {
		push = JSON.parse(user.pushTokens)
	} catch (e) {
		console.warn(e)
	}
	
	if (push.length) { await sendPush(JSON.parse(user.pushTokens), 'Уведомление', message) }
}