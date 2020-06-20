let sendMail = require('./mailApi')

module.exports = async (email, fullname, href) => {
	let mailOptions = {
		from: `"SmartChat" <${config.transport.auth.user}>`,
		to: email, 
		subject: 'Подтверждение Email',
		html: `
		<table>
			<tr>
				<td>Уважаемый ${fullname}</td>
			</tr>
			<tr>
				<td>Перейдите по ссылке для подтверждения вашего Email:</td>
				<td>${href}</td>
			</tr>
		</table>`
	}

	let ok = true
	await sendMail(mailOptions, (res)=> { ok = res.success })
	return ok
}