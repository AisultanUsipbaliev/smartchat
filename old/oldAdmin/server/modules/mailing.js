const sendMail = require('./mailApi');

module.exports = async (message, userInfo) => 
{
	await sendMail({
		from: `"SmartChat" <${config.transport.auth.user}>`,
		to: userInfo.email, 
		subject: 'Уведомление',
		html: 
		`	<table>
				<tr>
					<td>Уважаемый ${userInfo.login? userInfo.login: userInfo.firstname} ${userInfo.lastname}</td>
				</tr>
				<tr>
					<td>${message}</td>
				</tr>
			</table>
		`
	},(e)=>{ console.log('Собщение отправлено') });
}