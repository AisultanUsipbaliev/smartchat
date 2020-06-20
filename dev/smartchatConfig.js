let production = false

let config = {
	
	version: 2,
	students: 8,
	min_students: 3,
	groups: 3,
	lessonLength: 1,
	deafultPassword: 'smartchat',
	
	teacherPort: production? 	5555:3131,
	studentPort: production? 	1757:9797,
	socketPort: production? 	4545:7575,
	adminPort: production? 		3297:4949,
	jobPort: production? 		6974: 4796,
	
	// hostname: production? "https://web.smartchat.kz" : "https://m.smartchat.kz",
	teacherHostname: production? 	"https://cabinet.smartchat.kz" : "http://185.146.2.146:3131",
	studentHostname: production? 	"https://web.smartchat.kz" : "http://185.146.2.146:9797",
	adminHostname: production? 		"https://admin.smartchat.kz": "http://185.146.2.146:4949",
	jobHostname: production? 		"https://test.smartchat.su": "http://185.146.2.146:6974",

	database: {
		host 	: "localhost",
		user	: "root",
		password: "Mandriva2012",
		database: production? "smartchat" : "magic",
		port 	: 3306
	},
	
	adminSession: {
		key: 'index',
		secret: 'Mandriva',
		resave: true,
		saveUninitialized: true
	},	

	watsAppToken: 'd3339d4823c3463913860016d81469',	
	botToken: '737103729:AAEzrT-lpwFhqMuXG6IiVAOiDmDBgVPmeqM',
	
	myTelegramId: 537908946,
	telegramGroups: ['-226248107', '-268478418'],

	mobizonApiKey: 'kzd8ac24577077d98e231bc90a5ef9f21c5802d970beff17369f99f4ef2ffd0c6e437a',
	
	push: {
		id: '560601805027',
		collapse: 'AIzaSyAmJmSC2fav-2fNBr1Cvwtt0VSDl_Lfwtw',
		token: 'AAAAgoZ4sOM:APA91bFMDoTHIVeErCM8S7Lb38bpcqG8NgEUIozQD1tDK5CmNFX731zE1gk-sBm88mxtZVl82IeQSm8hXb_YDVPwaA_2U_QFKiwC3z30852vcz5K0xyhUsLYP3cG0eKphgS6WelWLKyF'
	},

	transport: {
		host: "smtp.mail.ru",
		port: 465,
		secure: true, 
		auth: {
			user: "smarty@smartchat.kz",
			pass: "Mandriva2012" 
		}
	},

	vk: {
		client_id: 	6766411,
		secret: 	'vI34pRZtXNHVePQCDQ9X',
		redirect: 	'https://web.smartchat.kz/auth/vk',
		v: 			5.92
	},

	mail: {
		client_id: 762797,
		secret: '2f75d26c78d24a40fda6c17ea9fd1a4a',
		private: '29677ab25cc73297d58fbdc524d90b4b',
		redirect: 'https://web.smartchat.kz/auth/mail'
	},

	google: {
		client_id: '560601805027-1rbukc25d0h5kjpa56vdm6mjc30e8sc9.apps.googleusercontent.com',
		scope: 'https://www.googleapis.com/auth/userinfo.profile',
		secret: '5GROtvk-6xm53jQHdI7gabq4',
		redirect: 'https://web.smartchat.kz/auth/google'
	},

	cloudpayments: {
		username: 'pk_eaff98b9708d86599925646c1e73c',
		password: 'a4bb4b8667e6fb412829e66585838abf',
		sendImmediately: false
	},
	
	amocrm: {
		registration		: 23639083,
		checkEnter 			: 21008860,
		checkTrial 			: 21008863,
		hasTrial 			: 23649415,
		wasted 				: 23713780,
		passed 				: 142,
		leaved 				: 143
	},

	production
}

module.exports = config
