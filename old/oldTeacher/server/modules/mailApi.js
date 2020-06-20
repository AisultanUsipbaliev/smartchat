let mailer 	= require('nodemailer');
let transporter = mailer.createTransport(config.transport);

module.exports = async function (mailOptions, cb) {
	console.log('mailApi')
	return transporter.sendMail(mailOptions)
	.then(function(data)
	{
		console.log(data)
		var result =
		{
			success:true,
			message:"Email Sent"
		}
		cb(result);
		transporter.close();
	})
	.catch(function(err)
	{
		console.log(err)
		var err= {
			success:false
		};
		cb(err);
		transporter.close();
	});
}