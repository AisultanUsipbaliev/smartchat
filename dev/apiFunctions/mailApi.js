let mailer 	= require('nodemailer');
let transporter = mailer.createTransport(config.transport);

module.exports = async function (mailOptions, cb) {

	return transporter.sendMail(mailOptions)
	.then(function(data)
	{
		var result =
		{
			success:true,
			message:"Email Sent"
		}
		cb(result);
		console.log('super')
		transporter.close();
	})
	.catch(function(err)
	{
		console.log(err)
		var err= 
		{
			success:false
		};
		cb(err);
	});
}