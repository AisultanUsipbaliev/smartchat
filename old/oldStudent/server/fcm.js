// var FCM = require('fcm-push');

// var serverKey = 'AAAAgoZ4sOM:APA91bFMDoTHIVeErCM8S7Lb38bpcqG8NgEUIozQD1tDK5CmNFX731zE1gk-sBm88mxtZVl82IeQSm8hXb_YDVPwaA_2U_QFKiwC3z30852vcz5K0xyhUsLYP3cG0eKphgS6WelWLKyF';
// var fcm = new FCM(serverKey);

// var message = {
//     to: 'evQzosLnUTw:APA91bFiqwr6g1dlCl81WqXyhWKAjK8mCHt9rMCjeIg_P9GFOi-N_Z7qgkK63IUtc-kyHdAWsIIffIlYd4izQn8_AVMdz_nlAR5ne-MQ2DTxamGDUB0VqIBP1sNhGvQPgpPY_X2Bz7q2', 
//     collapse_key: 'AIzaSyAmJmSC2fav-2fNBr1Cvwtt0VSDl_Lfwtw', 
//     data: {
//         your_custom_data_key: '560601805027'
//     },
//     notification: {
//         title: 'Чувак',
//         body: 'Тебе привет от моего сервера!',
//         icon: 'https://web.smartchat.kz/img/notify.png',
//         click_action: 'https://web.smartchat.kz'
//     }
// };

// //callback style
// fcm.send(message, function(err, response){
//     if (err) {
//         console.log("Something has gone wrong!", err);
//     } else {
//         console.log("Successfully sent with response: ", response);
//     }
// });

global.config = require('./config')
let sms = require('./functions/smsApi')

sms('+77088210209', '1425')