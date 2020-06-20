var ws = loadSocket();

window.socketCounter = 0;

window.layout = document.getElementById('navChat');
window.testLayout = document.getElementById('navTest');
window.homeworkLayout = document.getElementById('navHomework');

function loadSocket() {
	console.log('Connection...')
	window.socketCounter += 1; 
	let socket = new WebSocket(top.location.href.split('/')[0] == 'https:'?
			`wss://${top.location.href.split('/')[2]}/ws/`:
			'ws://91.215.136.18:7575/'
		);

	socket.onmessage = function(event)
	{ 
		event.preventDefault();
		let data = JSON.parse(event.data);
		if(!data.notice) console.log('no notice');
		else switch(data.notice) {
			case 1: 	socketMessage(data);							break; 
			case 5: 	notifSet( 'Уведомление', data.msg);				break; 
			case 7: 	notifSet( 'Уведомление', data.msg);				break;
			case 9: 	notifSet( 'Уведомление', 'Нужна ваша оценка');	break;
			case 10:
				if(data.sended) searchMes(data.last);
				notifSet( 'Уведомление', data.msg);
			break;
			case 11: 	iAmWriting(data);								break;
		}
	}

	socket.onclose = function(event) 
	{
		console.log('Disconected')
		if (window.socketCounter<100) ws = loadSocket();
	};

	socket.onerror = function(error) 
	{
		console.log('Error')
		// if (window.socketCounter<100) ws = loadSocket();
	};

	socket.onconnection = function() 
	{
		console.log('Connected')
		window.socketCounter = 0;
	};

	return socket;
}

function socketMessage(data)
{
	sound(1);
	data.delivered = data.delivered == true ? 1:0;

	if(data.delivered == 0) GetNotice('aplication', 'Ваше сообщение будет отправленно как только начнется урок');

	if(top.location.pathname == '/chat')
	{
		if(!userInSystem) notifTypes(data);

		data.sender_id = data.sender;
		delete data.sender;
		addMessage(data, msgs);
		chat_block.scrollTo(0, chat_block.scrollHeight);
	}
	else
	{
		if (!layout.children[2])
		{
	    	let dot = document.createElement('div');
	    	dot.classList.add('newMessage');
	    	layout.appendChild(dot);
	    }

		notifTypes(data);
	}

	if (data.type == 8) 
	{
		if(top.location.href.split('/')[3] != 'tests' && !testLayout.children[2])
		{
			let dot = document.createElement('div');
			dot.classList.add('newMessage');
			testLayout.appendChild(dot);
		}
	}

	if (data.type == 7) 
	{
		if(top.location.href.split('/')[3] != 'homework' && !homeworkLayout.children[2]) 
		{
			let dot = document.createElement('div');
			dot.classList.add('newMessage');
			homeworkLayout.appendChild(dot);
		}
	}
}

function searchMes(last) {
	if(top.location.pathname == '/chat')
	{
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


function notifTypes(data)
{
	switch (data.type) {
			case 1: notifSet( data.sender_name, data.content ); 					break;
			case 2: notifSet( data.sender_name, 'Прислал(-а) фотографию'); 			break;
			case 3: notifSet( data.sender_name, 'Прислал(-а) аудиозапись'); 		break;
			case 4: notifSet( data.sender_name, 'Прислал(-а) документ');			break;
			case 5: notifSet( data.sender_name, 'Прислал(-а) видео'); 				break;
			case 6: notifSet( 'Уведомление', data.content);  						break;
			case 7: notifSet( data.sender_name, 'Прислал(-а) домашнее задание'); 	break;
			case 8: notifSet( data.sender_name, 'Прислал(-а) тест'); 				break;
		}
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