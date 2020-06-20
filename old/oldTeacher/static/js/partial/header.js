	let handeled = false;
// Удержание уведомлений
	document.querySelector('.alert').addEventListener('mouseover', function (e) 
	{
		if(!e.target.classList.contains('alert_head')) handeled = true;
		else handeled = false;
	});
	document.querySelector('.alert').addEventListener('mouseout', function () 
	{
		handeled = false;
	});

//Сокеты
var ws = loadSocket();
var socketCounter = 0;
function loadSocket()
{
	let socket = new WebSocket(top.location.href.split('/')[0] == 'https:'?
		'wss://cabinet.smartchat.kz/ws/':
		'ws://cabinet.smartchat.kz:7575/');

	socket.onmessage = function(event) 
	{
		let data = JSON.parse(event.data); 
		console.log(data)
		switch(data.notice)
		{
			case 111: location.reload(); break;
			case 1:
			if(document.getElementById('msgs'))
			{
				sound(1);
				let children = contacts.children;
				let isopen = false;
				for(let i = 0; i<children.length; i++)
				{
					if(children[i].getAttribute('group_id') == data.group_id && children[i].classList.contains('current_contact'))
					{ 
						let fullMes = document.createElement('div')
						fullMes.classList.add('fullMes');
						console.log(data)
						switch(Number(data.type))
						{
							case 1:
							addSMS(data, fullMes);
							break; 
							case 2:
							addPicture(data, fullMes);
							break;
							case 3: 
							addAudio(data, fullMes);
							break;
							case 4:
							addFile(data, fullMes);
							break;
							case 5:
							addVideo(data, fullMes);
							break;
							case 7: 
							addHomeWork(data, fullMes);
							break;
							case 8: 
							addTest(data, fullMes); 
							break;
						}
						document.getElementById('msgs').appendChild(fullMes);
						isopen = true;
						ws.send(JSON.stringify({
							notice: 8,
							group_id: data.group_id
						}));
						downChat();
					}
				}
				if(!isopen) setMiss(data.group_id, 1);
			}
			else notifier(`Новое <a href="/chat">сообщение</a> от студента <a href="students?id=${data.student_id}">${data.sender_name}</a>`,'green');
			break;
			case 2:
			notifier(data.msg, 'green');
			sound(2);
			break;
			case 3:
			notifier(data.msg, 'red');
			sound(2);
			break;
			case 4:
			notifier(data.msg, 'red');
			sound(2);
			if(document.getElementById('reqs')) deleteReq(data.student_id);
			break;
			case 10:
			notifier(data.msg);
			break;
			case 11: 
			iAmWriting(data); 
			break;
			default:
			console.log('Invalid socket notice!');
			break;
		}
	};

	socket.onclose = function(event)
	{
		console.log('Соединение потеряно...', socketCounter);
		socketCounter += 1;
		if(socketCounter < 100) ws = loadSocket();
		else console.log('Соединение прервано!')
	};

	socket.onerror = function(error) {
		console.log('Произошла ошибка!')
	};

	socket.onconnect = function(e)
	{
		console.log('Подключено!');
		socketCounter = 0;
	}

	return socket;
}
 
//Выводим уведомления
	function getNotice(req)
	{
		let res = JSON.parse(req.response);
		if(req.status == 200)
		{
			let body = res.notice;

			for(let i = 0; i<body.length; i++) notifier(body[i].content, 'green');
			
			if(res.req_count != 0 && !document.getElementById('reqs')) 
				notifier('У вас новых заявок: ' + res.req_count);

			if(res.sms_count > 0 && !document.getElementById('contacts'))
				notifier('У вас новых сообщений: ' + res.sms_count);

			// if(res.tests != 0 && !document.getElementById('result-list'))
			// notifier('У вас непроверенных тестов: ' + res.tests, 'blue');

			if(res.graph == 0 && !document.querySelector('.gr_container'))
				notifier('Для работы с системой вам нужно <a href="/graph"> составить график </a>!', 'red');
		}
		else
		{
			console.log(res);
		}
	}

//СКРИПТ
	POST('/notice','method=GET', getNotice);
//Для уведомляера
		$('.hamburger').click(()=>{  
			$(".alert").css("transition",".5s");
			$(".alert").css("right","0");
			localStorage.setItem('notifier', true);
		});

		$('.alert_head').click(()=>{

			if(!handeled)
			{
				$(".alert").css("transition",".8s");
				$(".alert").css("right","-30vw");
				localStorage.setItem('notifier', false);
				

				// let notifier = document.getElementById('notifier');
				// notifier.innerHTML = '';
			}
			else
			{
				setTimeout(()=>
				{
					document.querySelector('.alert_head').click();
				}, 2000);
			}
		});

//Уводомляер
	function notifier(mail, color)
	{
		$(".alert").css("right","0");
		let li = document.createElement('li');
		li.innerHTML = mail;
		li.type = 'notifier';
		li.style.color = color;

		let notif = document.getElementById('notifier');
		notif.insertBefore(document.createElement('br'), notif.firstChild);
		notif.insertBefore(li, notif.firstChild);

		if(localStorage.getItem("notifier") == 'true'){
			document.querySelector('.hamburger').click();
		}
		setTimeout(()=>
		{
			document.querySelector('.alert_head').click();
		}, 2000);

		if(color == 'green') sound(2);
		else if(color == 'blue') sound(1);
		setTimeout(()=>
			{
				document.querySelector('.alert_head').click();
			}, 8000);
	}

//POST запрос
	function POST(route, params, funct)
	{
		let req = new XMLHttpRequest();
		req.onreadystatechange = function()
		{
			if(req.readyState == 4) funct(req);
		}
		req.open('POST',route);
		req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		req.send(params);
	}

//Загрузка файла
	function sendFile(route ,file, funct, name)
	{
		//Создаем объек FormData
        var data = new FormData();
        //Добавлем туда файл
        data.append('uploadFile', file);
        if(name) data.append('name', name);
        $.ajax({
            url: route,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(response) {
            	funct(response);
            }
        });
	}

//Звуковой генератор
	function sound(i)
	{
		let audio = new Audio();
		switch(i)
		{
			case 1: 
			audio.src = 'static/aud/pop.mp3';
			break;
			case 2:
			audio.src = 'static/aud/notif.wav';
			break;
		}
		// audio.play();
	}

//Работа с cookie
	function getCookie(name)
	{
	  return document.cookie.split(name+'=')[1].split(';')[0];
	}

	function setCookie(name, value, options) 
	{
	  options = options || {};

	  var expires = options.expires;

	  if (typeof expires == "number" && expires) 
	  {
	    var d = new Date();
	    d.setTime(d.getTime() + expires * 1000);
	    expires = options.expires = d;
	  }
	  if (expires && expires.toUTCString) 
	  {
	    options.expires = expires.toUTCString();
	  }

	  value = encodeURIComponent(value);

	  var updatedCookie = name + "=" + value;

	  for (var propName in options) 
	  {
	    updatedCookie += "; " + propName;
	    var propValue = options[propName];
	    if (propValue !== true) 
	    {
	      updatedCookie += "=" + propValue;
	    }
	  }

	  document.cookie = updatedCookie;
	}

	function deleteCookie(name) 
	{
	  setCookie(name, "", 
	  {
	    expires: -1
	  });
	}

function returnerTime(time){
  let minuts = 0;
  let seconds = 0;
  if(time > 60)
  while(time > 60){
    minuts++;
    time -= 60;
  }
  seconds = time;
  if(minuts < 10) minuts = '0' + minuts;
  if(seconds < 10) seconds = '0' + seconds;
  return minuts + ':' + seconds;
}


function iAmWriting(data) {
	let element = document.getElementById("writing"+data.group_id)
	if(element) if(element.style.visibility == 'hidden') {
		let action = data.type == 2? 'записывает аудио': 'печатает'
		
		element.style.visibility = 'visible'
		element.innerHTML = `${data.sender_name} ${action}...`


		window.writingInterval = setInterval(()=>{
			switch(getPointsCount(element.innerHTML)) {
				case 0: element.innerHTML = `${data.sender_name} ${action}.`; 	break;
				case 1: element.innerHTML = `${data.sender_name} ${action}..`; 	break;
				case 2: element.innerHTML = `${data.sender_name} ${action}...`; 	break;
				case 3: element.innerHTML = `${data.sender_name} ${action}`; 	break;	
			}
		}, 500)

		window.writingTimeout = setTimeout(()=>{
			clearInterval(window.writingInterval)
			element.style.visibility = 'hidden'
		}, 5000)
	}
}

function getPointsCount(str) {
	let cnt = 0
	for(let i = str.length - 1; i>=0; i--) {
		if(str[i] != '.') return cnt
		else cnt ++; 
	}
}
