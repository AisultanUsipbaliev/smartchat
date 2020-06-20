importScripts("https://www.gstatic.com/firebasejs/5.5.8/firebase-app.js")
importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-messaging.js')
// Initialize Firebase
var config = {
	authDomain: "smartchat-f938b.firebaseapp.com",
	databaseURL: "https://smartchat-f938b.firebaseio.com",
	projectId: "smartchat-f938b",
	storageBucket: "smartchat-f938b.appspot.com",
	messagingSenderId: "587790792968"
};

firebase.initializeApp(config);
var messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler(function(payload) {
//         console.log('Message received. ', payload);
//         // notifSet(payload.notification.title, payload.notification)
//     });