let sendMail = require('./mailApi');

module.exports = async function(message, userInfo) {
	try {
		await sendMail({
		from: `"SmartChat" <smarty@smartchat.kz>`,
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
	} catch(err) {
		sayMe('mailing', err.message)
		console.log(err)
	}
}