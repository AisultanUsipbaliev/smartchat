firebase.initializeApp({
    apiKey: "AIzaSyD4Mr3RrdYxpIBf1fA001kWssNCYebqlaY",
    authDomain: "smartchat-224404.firebaseapp.com",
    databaseURL: "https://smartchat-224404.firebaseio.com",
    projectId: "smartchat-224404",
    storageBucket: "smartchat-224404.appspot.com",
    messagingSenderId: "560601805027"
})
var messaging = firebase.messaging()

messaging.onMessage(function(payload) {
        console.log('Message received. ', payload)
        notifSet(payload.notification.title, payload.notification.body)
    })

if (!("Notification" in window)) 				console.log('Не поддерживает push')
else if (Notification.permission == 'granted') 	subscribe()
else if (Notification.permission != 'denied') 	Notification.requestPermission ((permisson) => {
		if (!('permisson' in Notification)) Notification.permisson = permisson
		if (permisson == 'granted') 		subscribe()
	})

function subscribe() {
	// запрашиваем разрешение на получение уведомлений
	messaging.requestPermission()
	.then(function () {
		// получаем ID устройства
		messaging.getToken()
		.then(function (currentToken) {
			if (currentToken) {
				sendTokenToServer(currentToken)
			} else {
				console.warn('Не удалось получить токен.')
			}
		})
		.catch(function (err) {
			console.warn('При получении токена произошла ошибка.', err)
		})
	})
	.catch(function (err) {
		console.warn('Не удалось получить разрешение на показ уведомлений.', err)
	})
}

// отправка ID на сервер
function sendTokenToServer(currentToken) {
	if(getCookie('SAI'))
	POST('/api', `method=PUSH-TOKEN&&token=${currentToken}`, (res, status)=>{
			if(status == 200)
				console.log('SENDED TOKEN: ', currentToken)
			else
				console.log('error!')
		})
}

function POST(route, params, funct)
{
  let req = new XMLHttpRequest()
  req.onreadystatechange = function()
  {
    if(req.readyState == 4) 
    {
      if(req.status == 404) getNotFoundPage()
      else
      {
        let res = JSON.parse(req.response)
        funct(res, req.status)
      }
    }
  }
  req.open("POST", route)
  req.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
  req.send(params)
}

function getCookie(name)
{
  try {
   return document.cookie.split(name+'=')[1].split(';')[0];
  }
  catch(ex)
  {
    return null;
  }
}