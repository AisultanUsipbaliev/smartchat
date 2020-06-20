var FCM = require('fcm-push')
var serverKey = 'AAAAgoZ4sOM:APA91bFMDoTHIVeErCM8S7Lb38bpcqG8NgEUIozQD1tDK5CmNFX731zE1gk-sBm88mxtZVl82IeQSm8hXb_YDVPwaA_2U_QFKiwC3z30852vcz5K0xyhUsLYP3cG0eKphgS6WelWLKyF';
var fcm = new FCM(serverKey)

module.exports = async function(to, title, text, url) {
	if(!url) url = 'https://web.smartchat.kz'		
	let message = {
		to,
		collapse_key: 'AIzaSyAmJmSC2fav-2fNBr1Cvwtt0VSDl_Lfwtw',
		data: { your_custom_data_key: '560601805027' },
		notification: {
			title, 
			body: text,
			icon: 'https://web.smartchat.kz/static/img/notify.png',
			click_action: url
		}
	}
	fcm.send(message, function(err, response) {
		if(err) console.log("Something has gone wrong!")
	})
}