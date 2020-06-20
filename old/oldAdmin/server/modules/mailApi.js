const mailer 	= require('nodemailer');
const transporter = mailer.createTransport(config.transport);

module.exports = async (mailOptions, cb) => 
{
	return transporter.sendMail(mailOptions)
	.then(function(data) { cb({ success:true, message:"Email Sent" }); transporter.close(); })
	.catch(function(err) { cb({ success:false }); transporter.close(); });
}