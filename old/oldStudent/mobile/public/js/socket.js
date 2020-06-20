var ws = loadSocket();

window.layout = document.getElementById('navChat');

function loadSocket() {
	let socket = new WebSocket(top.location.href.split('/')[0] == 'https:'?
			`wss://${top.location.href.split('/')[2]}/ws/`:
			'ws://91.215.136.18:7575/'
		);
	socket.onmessage = function(event)
	{
		event.preventDefault(); 
		let data = JSON.parse(event.data);
		if(!data.notice) console.log('no notice');
		else switch(data.notice)
		{
			case 1: 	socketMessage(data);			break; 
			case 5: 	GetNotice(data.msg); 			break; 
			case 7: 	GetNotice(data.msg);		 	break;
			case 9: 	socketFeed(data.teacherInfo);	break;
			case 10:  	GetNotice(data.msg); 			break;
			case 11: 	iAmWriting(data);				break; 
		}
	}

	socket.onclose = function(event) 
	{
		console.log('Соединение закрыто')
		ws = loadSocket();
	};

	socket.onerror = function(error) 
	{
		console.log('Произошла ошибка')
		// ws = loadSocket();
	};
	
	return socket;
}
function GetNotice(msg, func){
	if(!func) func = 'closePopup()';
	showPopup(`<span class="delete">${msg}!</span><br>
				<button class="deleteBtn" onclick="${func}">Ок</button>
			`,{width:'80%', height: 'auto', top: "200px"});;
}
function socketMessage(data)
{
	sound(1);
	data.delivered = data.delivered == true ? 1:0;

	if(data.delivered == 0) GetNotice('Ваше сообщение будет отправленно как только начнется урок');

	if(top.location.pathname == '/chat')
	{
		data.sender_id = data.sender;
		delete data.sender;
		addMessage(data, msgs);
	}
	else
	{
		GetNotice('Новое сообщение');
		Vibration(500);
	}
	if (data.type == 8) 
	{
		GetNotice('Новый тест!');
		Vibration(500);
	}

	if (data.type == 7) 
	{
		GetNotice('Новое домашнее задание!');
		Vibration(500);
	}
	chat_block.scrollTo(0, chat_block.scrollHeight);
}

function searchMes(data){
	if(top.location.pathname == '/chat')
		if(data == "Ваше занятие началось!"){
		let com = document.getElementsByClassName('complete');
		for (var i = 0; i < com.length; i++) 
			if(com[i].innerHTML == `<img src="/img/noncomplete.svg">`)
				com[i].innerHTML = `<img src="/img/complete.svg">`
		}
}

function socketFeed(teacher)
{
	feedback('SmartChat',['Напишите пару слов о SmartChat'],[],(data)=> {
		POST('/feedback', `method=SMART&&comment=${data.comments[0]}&&value=${data.value}`);
		feedback(teacher.firstname + ' ' + teacher.lastname,['Ваше мнение о преподавателе'],[],(data1)=>{
			POST('/feedback', `method=TEACHER&&comment=${data1.comments[0]}&&value=${data1.value}&&teacher_id=${teacher.id}`);
			thanksForFeedback()
		});
	}); 
}

function Vibration(val){
	console.log(navigator)
	if('vibrate' in navigator) return navigator.vibrate(val);
	if('oVibrate' in navigator) return navigator.oVibrate(val);
	if('mozVibrate' in navigator) return navigator.mozVibrate(val);
	if('webkitVibrate' in navigator) return navigator.webkitVibrate(val);
}

function iAmWriting(data) {
	let element = document.getElementById('iAmWriting')
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