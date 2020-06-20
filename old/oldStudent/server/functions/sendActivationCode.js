let mailApi = require('../functions/mailApi')
let studentModel = require('../model/student')

module.exports = async function(email, firstname, lastname, id) {
	let code = await generateId(20)
	await studentModel.updateEmailCode(id, code)

	let href = `${config.hostname}/activateEmail?code=${code}`

	let mailOptions = {
		from: `"SmartChat" <${config.transport.auth.user}>`,
		to: email, 
		subject: 'Активация аккаунта',
		html: `
		<table>
			<tr>
				<td>Уважаемый ${firstname} ${lastname}</td>
			</tr>
			<tr>
				<td>Перейдите по ссылке для активации аккаунта:</td>
				<td>${href}</td>
			</tr>
		</table>`
	}

	let ok = true

	await mailApi(mailOptions, (res)=> {
			ok = res.success
		})

	return ok
}