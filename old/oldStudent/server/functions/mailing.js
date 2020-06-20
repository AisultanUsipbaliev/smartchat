let sendMail = require('./mailApi');

module.exports = async function(message, userInfo) {
	if(userInfo.email)
		await sendMail({
			from: `"SmartChat" <${config.transport.auth.user}>`,
			to: userInfo.email, 
			subject: 'Уведомление',
			html: 
			`
				<table>
					<tr>
						<td>Уважаемый ${userInfo.login? userInfo.login: userInfo.firstname} ${userInfo.lastname}</td>
					</tr>
					<tr>
						<td>${message}</td>
					</tr>
				</table>
			`
			},(e)=>{});
}