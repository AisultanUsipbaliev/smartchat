const sendSms  = require('../modules/smsApi');
const sendMail = require('../modules/mailing');
const sendPush = require('../modules/pushing');

module.exports = async (user, message) =>
{
	if (user.smsOn && user.phone) 						{ await sendMail(message, user); } 
	if (user.mailOn && user.email) 						{ await sendSms(user.phone, message); } 
	if (JSON.parse(user.pushTokens).length>0) { await sendPush(JSON.parse(user.pushTokens), 'Уведомление', message); }
}