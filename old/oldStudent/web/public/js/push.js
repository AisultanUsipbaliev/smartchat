
var userInSystem = true;

window.onblur = function () {
	userInSystem = false;
} 

window.onfocus = function () {
	userInSystem = true;
}

function notifSet (title, text) {
	if (!("Notification" in window)) 
		console.log('Не поддерживает push')
	else if (Notification.permission == 'granted') 
		notifyMe(title, text)
	else if (Notification.permission != 'denied')
		Notification.requestPermission ((permisson) => {
			if (!('permisson' in Notification))
				Notification.permisson = permisson
			if (permisson == 'granted')
				notifyMe(title, text)
		})
}

function notifyMe (title, text) {
	let notification = new Notification ( title, {
		tag 	: 'ache-mail',
		body 	: text,
		icon 	: 'https://web.smartchat.kz/img/notify.png' 
	})
}