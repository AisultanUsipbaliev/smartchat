module.exports = {
	production 	: true,
	version 	: 1.4,
	port 		: 1757,

	server:{
		host 	: "localhost",
		user	: "root",
		password: "Mandriva2012",
		database: "smartchat",
		port 	: 3306
	},

	transport:
	{
	host: "smtp.mail.ru",
	port: 465,
	secure: true, 
	auth: {
			user: "noreply@smartchat.kz",
			pass: "@IBPvp3iJn6w" 
		}
	},

	vk: {
		client_id: 	6766411,
		secret: 	'vI34pRZtXNHVePQCDQ9X',
		redirect: 	'https://web.smartchat.kz/auth/vk',
		v: 			5.92
	},

	mail: {
		client_id: 	762797,
		secret: 	'2f75d26c78d24a40fda6c17ea9fd1a4a',
		private: 	'29677ab25cc73297d58fbdc524d90b4b',
		redirect: 	'https://web.smartchat.kz/auth/mail'
	},

	google: {
		client_id: 	'560601805027-1rbukc25d0h5kjpa56vdm6mjc30e8sc9.apps.googleusercontent.com',
		scope: 		'https://www.googleapis.com/auth/userinfo.profile',
		secret: 	'5GROtvk-6xm53jQHdI7gabq4',
		redirect: 	'https://web.smartchat.kz/auth/google'
	},
	cloudpayments: {
		username		: 'pk_eaff98b9708d86599925646c1e73c',
		password 		: 'a4bb4b8667e6fb412829e66585838abf',
		sendImmediately	: false
	},
	amocrm : {
		registration		: 23639083,
		checkEnter 			: 21008860,
		checkTrial 			: 21008863,
		hasTrial 			: 23649415,
		wasted 				: 23713780,
		passed 				: 142,
		leaved 				: 143
	},
	
	hostname: "https://web.smartchat.kz"
}