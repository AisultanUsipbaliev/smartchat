let bcrypt 	= require('bcryptjs');
let axios 	= require('axios');
let model 	= require('../models/account');
let mailer 	= require('nodemailer');

let transporter = mailer.createTransport(config.transport);

exports.addPushToken = async function (req) {
	if(!req.body.token) return {status: 418, message: 'no token'}

	let res = await model.addToken(req.body.myId, req.body.token);
	if(res) return {status: 200}
	else	return {status: 202}
}

exports.newEmail = async function (req) {
	if(!req.body.email) 	return {status: 418, message: 'no email'};
	if(!req.body.myId) 	return {status: 418, message: 'no cookies'};

	let studentInfo = await model.getStudent(req.body.myId);

	let ok = await sendActivationCode(req.body.email, studentInfo.firstname, studentInfo.lastname, req.body.myId);
	if(!ok) return {status: 401, message: 'wrong email'}; 

	let result = await model.updateEmail(req.body.myId, req.body.email);

	if(result) 	return {status: 200, message: 'success'};
	else 		return {status: 202, message: 'backend error'};
}

exports.repeatEmail = async function(req) {
	let studentInfo = await model.getStudent(req.body.myId);
	let ok = sendActivationCode(studentInfo.email, studentInfo.firstname, studentInfo.lastname, studentInfo.student_id);
	return ok ? {status: 200}: {status: 202};
}

async function sendActivationCode(email, firstname, lastname, id)
{
	let code = makeid();
	await model.updateEmailCode(id, code);

	let href = `${config.hostname}/activateEmail?code=${code}`;

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

	let ok = true;

	await sendMail(mailOptions, (res)=>
		{
			ok = res.success;
		});

	transporter.close();
	return ok;
}


function makeid() 
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


function sendMail(mailOptions, cb)
{
	return transporter.sendMail(mailOptions)
	.then(function(data)
	{
		var result =
		{
			success:true,
			message:"Email Sent"
		}
		cb(result);
	})
	.catch(function(err)
	{
		var err= 
		{
			success:false
		};
		cb(err);
	});
}