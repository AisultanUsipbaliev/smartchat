// Глобальные переменные
	let contacts = document.getElementById('contacts');
	let current_group = 0;
	let msgs = document.getElementById('msgs');
	let files = document.getElementById('files');
	let file = document.getElementById('file');
	let templates = document.getElementById('templates');
	let audio = new Audio();
	let current_time_td;
	let current_progress;
	let current_img;
	let minute = 0;
	let seconds = 0;
	let activeMic = false; 
	let timer;
	let value = '';
	let moveTemplate = true;
	window.mes_id;
	window.scrollFlag;
	window.element;
	window.answerMes = -1;

//Глобальные переменные для скролла
	let msgs_block = document.getElementById('msgs_block')
	let blockVSbody = null;
	let scrollBar = document.getElementById('scroll');
	let block = document.getElementById('scrollBlock');
	let StudentsCount = null;
	let scrollPerson = false;
	let msgsChildren = null;
// Вниз чат
	function downChat()
	{
		block.scrollTo({
		    top: block.scrollHeight,
		    behavior: "smooth"
		});
	}

//Функция удаляет - в конце названия группы
	function deleteSlash(name)
	{
		let mas = name.split('-');
		let ans = '';
		for(let i = 0; i<mas.length-1; i++) ans+= mas[i];
		if(ans.length > 0) return ans;
		else return name;
	}

// Функци создает шаблон
	function addTemplate(conts, isused)
	{
		let template 	= document.createElement('div');
		template.id 	= 'template='+conts[0].temp_id;
		let h 			= document.createElement('h4');
		let pictures 	= document.createElement('div');
		let audios 		= document.createElement('div');
		let files 		= document.createElement('div');
		let videos 		= document.createElement('div');

		template.classList.add('template');
		pictures.classList.add('content');
		audios.classList.add('content');
		files.classList.add('content');
		videos.classList.add('content');

		for(let i = 0; i<conts.length; i++)
		{
			switch(Number(conts[i].type))
			{
				case 1: h.innerHTML = conts[i].content; break;
				case 2: addTempPicture('/common/files/' + conts[i].content, pictures); break;
				case 3: addTempAudio('/common/files/' + conts[i].content, audios); break; 
				case 4: addTempFile('/common/files/' + conts[i].content, files); break;
				case 5: addTempVideo('/common/files/' + conts[i].content, videos); break;
				default:
				console.log('type = ' + conts[i].type)
				break;
			}
		}

		template.appendChild(h);
		template.appendChild(pictures);
		template.appendChild(audios);
		template.appendChild(files);
		template.appendChild(videos);

		let fresh = document.createElement('img');
		fresh.classList.add('fresh');
		fresh.src = 'static/img/fresh.png';
		fresh.addEventListener('click',()=>
		{
			template.classList.remove('isused');
		});
		template.appendChild(fresh);

		template.addEventListener('click', (e)=>
		{
			if(!template.classList.contains('isused'))
			{
				let text = template.querySelector('h4').innerHTML;
				document.getElementById('text').value += text+'\n';

				let pictures = template.getElementsByClassName('temp_image');
				for(let i = 0; i<pictures.length; i++) 
				{
					let name = pictures[i].src.split('/');
					name = name[name.length-1];
					hangFile( name, 2, name);
				}

				let audios = template.getElementsByClassName('temp_audio');
				for(let i = 0; i<audios.length; i++) 
				{
					let name = audios[i].getAttribute('target').split('/');
					name = name[name.length-1];
					hangFile( name, 3, name);
				}

				let files = template.getElementsByClassName('temp_file');
				for(let i = 0; i<files.length; i++) 
				{
					let name = files[i].getAttribute('target').split('/');
					name = name[name.length-1];
					hangFile( name, 4, name);
				}
				
				let videos = template.getElementsByClassName('temp_video');
				for(let i = 0; i<videos.length; i++)
				{
					let name = videos[i].src.split('/');
					name = name[name.length-1];
					hangFile( name, 5, name);
				}

				POST('/template', 'method=USE&&group_id='+current_group+ '&&temp_id=' + template.id.split('=')[1], (req)=>
					{
						if(req.status == 200)
						{
							template.classList.add('isused');
						}
					});
			}
		});
	
		if(isused == 1) template.classList.add('isused');
		
		templates.appendChild(template);
	}

// Функция добавляет картинку в шаблон
	function addTempPicture(content, layout)
	{
		let img = document.createElement('img');
		img.classList.add('temp_image');
		img.src = content;
		layout.appendChild(img);
	}

// Функция добавляет аудио в шаблон
	function addTempAudio(content, layout)
	{
		let block = document.createElement('div');
		block.classList.add('temp_audio');
		block.setAttribute('target', content);
		let img = document.createElement('img');
		img.classList.add('play_btn');
		img.src = "static/img/play.png";

		let line = document.createElement('div');
		line.classList.add('audio_line');
		line.style.width = '15vh';	

		let progress = document.createElement('div');
		progress.classList.add('audio_progress');

		line.appendChild(progress);

		let a = document.createElement('a');


		line.addEventListener('click', (e)=>
		{
			if(!e.target.classList.contains('audio_progress') && progress == current_progress)
			{
				let max = line.offsetWidth;
				let cur = e.offsetX;

				let procent = cur/max;

				let toset = audio.duration * procent;
				audio.currentTime = toset;
			}
		});

		img.addEventListener('click', () => 
		{
			let ms = img.src.split('/');

			if(ms[ms.length-1] == 'play.png') 
			{
				let buts = document.getElementsByClassName('play_btn');
				for(let i = 0; i<buts.length; i++) buts[i].src = 'static/img/play.png';
				audio.src = content;
				audio.play(); 
				img.src = 'static/img/pause.png';

				current_time_td = a;
				current_progress = progress;
				current_img = img;
			}
			else 
			{
				img.src = 'static/img/play.png'
				audio.pause();
			}
		});

		block.appendChild(img);
		block.appendChild(line);
		block.appendChild(a);
		layout.appendChild(block);
	}

// Функция добавляет файл в шаблон
	function addTempFile(content, layout)
	{
		let file = document.createElement('div');
		file.classList.add('temp_file');
		file.setAttribute('target', content);
		let img = document.createElement('img');
		img.src = 'static/img/file.png';

		file.appendChild(img);

		let p = document.createElement('p');
		let name = content.split('/')
		name = name[name.length-1];
		p.title = name;
		p.innerHTML = name;

		file.appendChild(p);

		file.addEventListener('click', ()=>
		{
			window.open(content, '_blank');
		});

		layout.appendChild(file);
	}

// Функция добавляет видео в шаблон
	function addTempVideo(content, layout)
	{
		let video = document.createElement('video');
		video.controls = 'true';
		video.classList.add('temp_video');
		video.src = content;
		layout.appendChild(video);
	}

// Функция генегирует произвольную строку
	function makeid() 
	{
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < 10; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

// Движение слайдера!
	audio.addEventListener('timeupdate', () =>
		{
			current_time_td.innerHTML = returnerTime(audio.currentTime^0);

			let position = audio.currentTime / audio.duration * 100;
			current_progress.style.left = position + '%';

			if(audio.currentTime == audio.duration) 	
			{
				current_img.src = 'static/img/play.png';
				current_progress.style.left = '0%';
			}
		});

// Функция определяющая тип файла
	function getFileType(file)
	{
		let type = file.type.split('/')[0];
		switch(type)
		{
			case 'image': 	return 2;
			case 'audio': 	return 3;
			case 'video': 	return 5;
			default: 		return 4;
		}
	}

// Функция возвращает время по секундам
	function getTime(sec)
	{
		let time = '';
		let min 	= Math.round(sec / 60); 
		let hour 	= Math.round(min / 60); 

		while(min >= 60) min -= 60; 

		sec = Math.round(sec);
		while(sec >= 60) sec -= 60;

		if(hour > 0) time = time + hour + ':';

		if(min > 9) time = time + min + ':';
		else time = time + '0' + min + ':';

		if(sec > 9) time += sec;
		else time += '0'+ sec;

		return time;
	}

// Функция меняет подсветку групп / id - это group_id
	function changeGroup(id)
	{
		current_group = id;
		let divs = contacts.children;
		for(let i = 0; i < divs.length; i++)
		{
			divs[i].classList.remove('current_contact');
			if(divs[i].getAttribute('group_id') == id) divs[i].classList.add('current_contact');
		}
		if(document.getElementById('answer' + answerMes))
		msgs_block.removeChild(document.getElementById('answer' + answerMes));
		answerMes = -1;
	}

// Функция для получения списка групп
	function getGroups(req)
	{
		let res = JSON.parse(req.response);
		if(req.status == 200)
		{
			let body = res.body;
			for(let i = 0; i < body.length; i++)
			{
				let div = document.createElement('div');
				let photo_div = document.createElement('div');
				let photo = document.createElement('img');
				let info_div = document.createElement('div');
				let name = document.createElement('h2');
				let type = document.createElement('div');

				div.classList.add('contact');
				photo_div.classList.add('photo_div');
				photo.classList.add('photo');
				info_div.classList.add('info_div');
				name.classList.add('name');
				type.classList.add('type');

				div.setAttribute('group_id', body[i].group_id);
				photo_div.setAttribute('group_id', body[i].group_id);
				photo.setAttribute('group_id', body[i].group_id);
				info_div.setAttribute('group_id', body[i].group_id);
				name.setAttribute('group_id', body[i].group_id);
				type.setAttribute('group_id', body[i].group_id);
				if(body[i].group_name.length > 20)
				{
					name.title = body[i].group_name;
					body[i].group_name = body[i].group_name.substr(0,17) + '...';
				}
				if(body[i].group_type == 0) name.innerHTML = body[i].group_name;
				else name.innerHTML =  deleteSlash(body[i].group_name);
				let group_type;
				if(body[i].group_type == 0) group_type = 'Групповой';
				else group_type = 'Индивидуальный';

				type.innerHTML = `	<p group_id="${body[i].group_id}">тип: </p>
									<strong group_id="${body[i].group_id}">${group_type}</strong>`;
				if(body[i].group_type == 0) photo.src = 'static/img/chat.png';
				else photo.src = 'static/img/individ.png';

				let writing = document.createElement('span')
				writing.id = "writing"+body[i].group_id
				writing.style.fontSize = '9px'
				writing.style.position = 'absolute'
				writing.style.margin = '32px 0 0 10px'
				writing.style.visibility = 'hidden'

				photo_div.appendChild(photo);
				info_div.appendChild(name);
				// info_div.appendChild(type);
				info_div.appendChild(writing);

				if(body[i].lesson) div.style.color = '#0088b8'
				
				div.appendChild(photo_div);
				div.appendChild(info_div);
				contacts.appendChild(div);
			}
			POST('/chat','method=GET-MISS', getMiss);
		}
		else console.log(res);
	}

// Функция устанавливает количество непрочитанных сообщений
	function setMiss(id, count)
	{
		let children = contacts.children;

		for(let i = 0 ; i < children.length; i++)
		{
			if(children[i].getAttribute('group_id') == id)
			{
				let div = children[i].querySelector('.info_div');
				if(!div.querySelector('.missCount'))
				{
					let span = document.createElement('span');
					span.classList.add('missCount');
					span.innerHTML = count;
					span.setAttribute('group_id', id);
					div.appendChild(span);
				}
				else
				{
					let span = div.querySelector('.missCount');
					let c = Number(span.innerHTML);
					span.innerHTML = c + count;
				}
			}
		}

		groupOrderUp(id);
	}

	function groupOrderUp(id) {

		let theFirstChild = contacts.firstChild;

		let children = contacts.children;

		for(let i = 0 ; i < children.length; i++)
		{
			if(children[i].getAttribute('group_id') == id)
			{
				contacts.insertBefore(children[i], theFirstChild);
			}
		}
	}

// Функция удаляет количество непрочитанных сообщений
	function deleteMiss(id)
	{
		let children = contacts.children;

		for(let i = 0 ; i < children.length; i++)
		{
			if(children[i].getAttribute('group_id') == id)
			{
				let div = children[i].querySelector('.info_div');
				if(div.querySelector('.missCount'))
				{
					let count = div.querySelector('.missCount');
					div.removeChild(count);
				}
			}
		}
	}

// Функция показывает непрочитанные сообщения
	function getMiss(req)
	{
		let res = JSON.parse(req.response);
		if(req.status == 200)
		{
			let body = res.body;
			for(let i = 0; i<body.length; i++) setMiss(body[i].group_id, body[i].count);
		}
		else console.log(res);
	}

	function compareNumeric(a, b) {
	  if (a.mes_id > b.mes_id) return -1;
	  if (a.mes_id < b.mes_id) return 1;
	}

	function compareDt(a, b) {
	  if (a.dt > b.dt) return 1;
	  if (a.dt < b.dt) return -1;
	}


// Функция показывает чат
	function getMes(req)
	{
		window.scrollFlag = true;
		document.querySelector('.box').style.display = 'block';
		let res = JSON.parse(req.response);
		msgs.innerHTML = '';
		if(req.status == 200)
		{	
			let body = res.body;
			body.sort(compareDt);
			for(let i = 0; i < body.length; i++)
			{
				let fullMes = document.createElement('div')
				fullMes.classList.add('fullMes');
				switch(body[i].type)
				{
					case 1: addSMS(body[i], fullMes); break;
					case 2: addPicture(body[i], fullMes); break;
					case 3: addAudio(body[i], fullMes); break;
					case 4: addFile(body[i], fullMes); break;
					case 5: addVideo(body[i], fullMes); break;
					case 7: addHomeWork(body[i], fullMes); break;
					case 8: addTest(body[i], fullMes); break;
					default: console.log('Invalid chat type'); break;
				}
				msgs.appendChild(fullMes);
				if(msgs.clientHeight < block.clientHeight) scrollBar.style.display = 'none'
				else scrollBar.style.display = 'block';
				block.scrollTo(0, block.scrollHeight)
			}


			blockVSbody = block.clientHeight / msgs.clientHeight;
			scrollBar.style.height = (block.clientHeight * blockVSbody) + 'px';
			msgsChildren = msgs.children.length;
			for (var i = 0; i < msgs.children.length; i++) {	
				StudentsCount += msgs.children[i].clientHeight;
				var style = window.getComputedStyle(msgs.children[i]);
				var marginTop = style.getPropertyValue('margin-top'); 
				StudentsCount += Number(marginTop.substring(0, marginTop.length - 2))
			}
			StudentsCount /= block.clientHeight;

			if(msgs.clientHeight < block.clientHeight) scrollBar.style.display = 'none'
			else scrollBar.style.display = 'block';

			let timesRun = 0;
			let interval = setInterval(function()
			{
			    timesRun += 1;
			    if(timesRun === 45)
			    {
			        clearInterval(interval);
			    }
			    block.scrollTo(0, block.scrollHeight)
			}, 10); 

			body.sort(compareNumeric);

			window.mes_id = body[body.length-1].mes_id; 
		}
		else if(req.status == 202)
		{
			let img = document.createElement('img');
			img.classList.add('logotip');
			img.style.top = 0;
			img.src = 'static/img/logo.png';
			msgs.appendChild(img);
		}
		else console.log(res);
	}

	function getPartMes(req) {
		document.querySelector('.box').style.display = 'block';
		let res = JSON.parse(req.response);
		if(req.status == 200)
		{	
			let body = res.body;
			for(let i = 0; i < body.length; i++)
			{
				let fullMes = document.createElement('div')
				fullMes.classList.add('fullMes');
				switch(body[i].type)
				{
					case 1: addSMS(body[i], fullMes); 					break;
					case 2: addPicture(body[i], fullMes);				break;
					case 3: addAudio(body[i], fullMes); 				break;
					case 4: addFile(body[i], fullMes); 					break;
					case 5: addVideo(body[i], fullMes); 				break;
					case 7: addHomeWork(body[i], fullMes);				break;
					case 8: addTest(body[i], fullMes); 					break;
					default: console.log('Invalid chat type'); 			break;
				}
				msgs.insertBefore(fullMes, msgs.firstChild);
			}
			
			window.scrollFlag = true;
			body.sort(compareNumeric);
			window.mes_id = body[body.length-1].mes_id; 
		}
	}

// Функция отправляет сообщение сокетом
	function sendMes()
	{
		let fls = files.children;
		let box = document.getElementById('text');
		let text = box.value;
		text = text.trim();
		text = text.replace(/</g, '&lt;');
		text = text.replace(/>/g, '&gt;');

		if(fls.length > 0)
		{
			for(let i = 0; i<fls.length; i++)
			{
				text = box.value;
				text = text.trim();
				let type = fls[i].getAttribute('type');
				let path = fls[i].getAttribute('path');
				ws.send(JSON.stringify(
				{
					notice: 1,
					group_id: current_group,
					content: path,
					type,
					reference: `${answerMes != -1 ? answerMes : ''}`,
					title: text
				}));
				if(answerMes != -1){
					if(!teach)
						document.getElementById('mes' + answerMes).style.backgroundColor = '#fff'
					else document.getElementById('mes' + answerMes).style.backgroundColor = '#92a7d0'
					msgs_block.removeChild(document.getElementById('answer' + answerMes));
				}
				answerMes = -1;
				box.value = '';
				groupOrderUp(current_group);
			}
			files.innerHTML = '';
			moveInput();
		}
		else
		{
			if(text.length > 0)
			{
				ws.send(JSON.stringify(
				{
					notice: 1,
					group_id: current_group,
					content: text,
					reference: `${answerMes != -1 ? answerMes : ''}`,
					type: 1
				}));
				if(answerMes != -1){
					if(!teach)
						document.getElementById('mes' + answerMes).style.backgroundColor = '#fff'
					else document.getElementById('mes' + answerMes).style.backgroundColor = '#92a7d0'
					msgs_block.removeChild(document.getElementById('answer' + answerMes));
				}
				answerMes = -1;
				box.value = '';
				groupOrderUp(current_group);
			}
		}
	};

// Функция прикрептяет файл к чату
	function hangFile(name, type, path)
	{
		deleteLoad();
		let div = document.createElement('div');
		let img = document.createElement('img');
		let a 	= document.createElement('span');
		let rem = document.createElement('img');

		div.classList.add('file_block');
		img.classList.add('file_img');
		a.classList.add('fname');
		rem.classList.add('rem_img');

		div.id = makeid();
		div.setAttribute('type', type);
		div.setAttribute('path', path)
		rem.setAttribute('delete', div.id);

		img.src = 'static/img/file.png';
		rem.src = 'static/img/rem.png';
		
		a.title = name;

		if(name.length > 10) name = name.substr(0,10) + '...';

		a.innerHTML = name;
		div.appendChild(img);
		div.appendChild(a);
		div.appendChild(rem);

		files.appendChild(div);
		moveInput();
	}

// Скрипт
	POST('/chat','method=GET-CHAT', getGroups);

// Обработка нажатия Enter в поле text
	document.getElementById('text').addEventListener('keyup', function(ev) 
	{
		ws.send(JSON.stringify({
			notice: 11, 
			group_id: current_group
		}))
		if(ev.ctrlKey && ev.keyCode == 13) 
		{
			let box = document.getElementById('text'); 
			box.value = box.value + '\n';
		}
		else if(!ev.ctrlKey && ev.key == 'Enter') document.getElementById('send').click();
	});

// Обработка нажатия на контакт
 document.getElementById('contacts').addEventListener('click', function(e)
	{
		if(e.target.getAttribute('group_id'))
		{
			let group_id = e.target.getAttribute('group_id');
			if(group_id != current_group)
			{
				audio.pause();
				deleteMiss(group_id);
				changeGroup(group_id);
				document.getElementById('templateArrow').style.display = 'block';

				POST('/chat', 'method=GET&group_id='+group_id, getMes); 
				POST('/template', 'method=GET-TEMP&&group_id=' + group_id, (req)=>
				{
					let res = JSON.parse(req.response);
					templates.innerHTML = '';
					if(req.status == 200 && res.body[0][0])
					{
						if(moveTemplate === true)
						{
							document.getElementById("chat").style.width = 80 +"vh";
							templates.style.width = 30 + "vh";
							templates.style.display = "none";
							text.style.width = "92%";
							setTimeout(function(){
								templates.style.display = "block";
								},400)
							document.getElementById("templateArrowImg").style.transform = "rotate(0deg)";
							arrowposition = true;
						}

						let used = res.used;
						let body = res.body;
						body = body.sort(function(a, b) { return a[0].order - b[0].order; });
						
						for(let i = 0; i<body.length; i++)
						{
							let isused = 0;
							for(let z = 0; z<used.length; z++)
								if(body[i][0].temp_id == used[z].temp_id) isused = 1;

							addTemplate(body[i], isused);
						}
					}
					else
					{
						templates.innerHTML = `<p class="nopeTemplates">У вас нет шаблонов для этой группы!</p>`;
						document.getElementById("chat").style.width = 110 +"vh";
						templates.style.width = 0 + "vh";
						templates.style.display = "none";
						document.getElementById("templateArrowImg").style.transform = "rotate(180deg)";
						arrowposition = false;	
					}
				});
			}
		}
	});

// Обработка нажания на микрофон
	var gumStream; 
	var rec
	var AudioContext = window.AudioContext || window.webkitAudioContext
	var canSendAudio
	var isRecording = false

	function startRecording() {
		navigator.mediaDevices.getUserMedia({ audio: true, video:false }).then(function(stream) {

			gumStream = stream;
			var audioContext = new AudioContext;
			let input = audioContext.createMediaStreamSource(stream);
			rec = new Recorder(input,{numChannels:1})
			rec.record()

		})
	}

	function stopRecording() {
	 	/**/
		rec.stop();
		gumStream.getAudioTracks()[0].stop();
		rec.exportWAV((blob)=>{
			if(canSendAudio) { 
				sendAudio(blob)
				canSendAudio = false
			}
		});
		/**/
	}


	document.getElementById('microfon').addEventListener('click', function(e) {

		if(!isRecording) {
			audioTimeout = setTimeout(()=> {
					canSendAudio = true
				}, 3000)
			startRecording()
			animateMic()
		} else {
			stopRecording()
			animateMic()
			clearTimeout(audioTimeout)
		}
		isRecording = !isRecording
	})

	function sendAudio(blob) {
		sendFile('/sendFile', blob, response=>{
			ws.send(JSON.stringify({
				notice: 1,
				group_id: current_group,
				content: response,
				type: 3
			}));
		}, new Date().valueOf() + '.wav');
	}

// Обработка нажатия на корзину
	files.addEventListener('click', function(e)
		{
			if(e.target.classList.contains('rem_img'))
			{
				files.removeChild(document.getElementById(e.target.getAttribute('delete')));
			}
			moveInput();
		});

// Обработка добавления файла
	file.addEventListener('change', function(e)
	{
		createLoad();
		let fl = file.files[0];
		let type = getFileType(fl);
		if(fl.type != 'text/javascript' && fl.type != 'application/x-javascript')
			sendFile('/sendFile', fl, (response) => 
			{
				hangFile( fl.name, type, response);
			})
		else notifier('В чат нельзя отправлять файлы подобного формата!','red')
	});

// Обработка нажатия на wclose (закрываем popup с картинкой)
	document.getElementById('close_img').addEventListener('click', function()
		{
			document.getElementById('caption').classList.remove('caption');
			document.getElementById('caption').classList.add('backzoom');
			setTimeout(()=>{ document.querySelector('.popImg').style.display = 'none'; }, 300);
		});

// Функция удаляет из чата логотип
	function removePict() 
	{
		if(msgs.children[0] && msgs.children[0].classList.contains('logotip'))
		msgs.innerHTML = '';
		document.getElementById('templateArrow').style.display = 'block';
	}

// Функция открывает/закрывает шаблоны
	window.arrowposition = false;
	function openTemplate(){
		if (arrowposition == false) {
			document.getElementById("chat").style.width = 80 +"vh";
			templates.style.width = 30 + "vh";
			setTimeout(function(){
				templates.style.display = "block";
			},400);
			text.style.width = "92%";
			files.style.marginLeft = '7.5vh';
			document.getElementById("templateArrowImg").style.transform = "rotate(0deg)";
			arrowposition = true;
			moveTemplate = true;
		}else{
			document.getElementById("chat").style.width = 110 +"vh";
			templates.style.width = 0 + "vh";
			document.getElementById("templateArrowImg").style.transform = "rotate(180deg)";
			templates.style.display = "none";
			files.style.width = "87.5%";
			text.style.width = "95%";
			arrowposition = false;		
			moveTemplate = false;
		}
	}

// Функция добавляет сообщение в чат
	function addSMS(data, layout) 
	{
		let id = data.mes_id;
		let isteacher = data.isteacher; 
		let name = data.firstname;
		if(!name) name = data.sender_name;
		let sms = data.content;
		let dat = getTimeMes(data.dt);

		removePict();
		let messageChees = document.createElement('div');
		messageChees.classList.add('messageChees');
		let div = document.createElement('div');
		div.id = 'mes' + id;
		if(isteacher) div.classList.add('right_message', "text_message");
		else div.classList.add('left_message', "text_message");
		

		div.innerHTML = '<p class="sms">' + sms + '</p><div class="sms_date">' + dat + '</div>';

		if(!isteacher)
		{
			let p = document.createElement('p');
			p.classList.add('student_name');
			p.innerHTML = name;
			// div.appendChild(p);
		}
		if(data.reference){
			paintReferense(data,div);
		}
		let answerMesBlock = document.createElement('img');
		answerMesBlock.classList.add('answerMesBlock');
		if(!isteacher)	answerMesBlock.classList.add('left_ans')
		else answerMesBlock.classList.add('right_ans')
		answerMesBlock.src = 'static/img/answerMes.png'
		answerMesBlock.addEventListener('click',function(e){
			answerOnMes(id, isteacher);
		})
		if(isteacher){
			messageChees.style.justifyContent = "flex-end"
			messageChees.appendChild(answerMesBlock);
			messageChees.appendChild(div);
		}else{
			answerMesBlock.style.marginTop = "4vh";
			messageChees.appendChild(div);
			messageChees.appendChild(answerMesBlock);

		}
		layout.appendChild(messageChees);
	}

// Функция добавляет картинку в чат
	function addPicture(data, layout) 
	{
		let id = data.mes_id;
		let isteacher = data.isteacher; 
		let name = data.firstname;
		let path = data.content;
		let dat = getTimeMes(data.dt);
		let title = data.title;

		removePict();

		let messageChees = document.createElement('div');
		messageChees.classList.add('messageChees');
		let div = document.createElement('div');
		div.id = 'mes' + id;
		if(isteacher) div.classList.add('right_message', 'img_message');
		else div.classList.add('left_message', 'img_message');
		let img = document.createElement('img');
		img.classList.add('chat_picture');
		img.src = 'common/files/' + path;

		img.addEventListener('click', function() 
		{
			document.getElementById('caption').classList.remove('backzoom');
			document.getElementById('caption').classList.add('caption');
			document.querySelector('.popImg').style.display = 'block';
			document.querySelector('#popImg').src = this.src;
		});

		if(title)
		{
			let p = document.createElement('p');
			p.innerHTML = title;
			p.classList.add('fileTitle');
			div.appendChild(p);
		}

		div.appendChild(img);

		if(!isteacher)
		{
			let p = document.createElement('p');
			p.classList.add('student_name');
			p.innerHTML = name;
			// div.appendChild(p);
		}


		let datBlock = document.createElement('div');
		datBlock.classList.add('sms_date');
		datBlock.innerHTML = dat;
		div.appendChild(datBlock);

		if(data.reference){
			paintReferense(data,div);
		}
		let answerMesBlock = document.createElement('img');
		answerMesBlock.classList.add('answerMesBlock');
		answerMesBlock.src = 'static/img/answerMes.png'
		answerMesBlock.addEventListener('click',function(e){
			answerOnMes(id, isteacher);
		})
		
		if(isteacher){
			messageChees.style.justifyContent = "flex-end"
			messageChees.appendChild(answerMesBlock);
			messageChees.appendChild(div);
		}else{
			answerMesBlock.style.marginTop = "4vh";
			messageChees.appendChild(div);
			messageChees.appendChild(answerMesBlock);

		}
		layout.appendChild(messageChees);
	}

// Функция добавляет аудио в чат
	function addAudio(data, layout)
	{
		let id = data.mes_id;
		let isteacher = data.isteacher; 
		let name = data.firstname;
		let path = data.content;
		let dat = getTimeMes(data.dt);
		let title = data.title;

		removePict();
		let messageChees = document.createElement('div');
		messageChees.classList.add('messageChees');
		let div = document.createElement('div');
		div.id = 'mes' + id;
		if(isteacher) div.classList.add('right_message');
		else div.classList.add('left_message');

		let table 	= document.createElement('table');
		let tr 		= document.createElement('tr');
		let pict_td = document.createElement('td');
		let line_td = document.createElement('td');
		let time_td = document.createElement('td');
		let line = document.createElement('span');
		line.classList.add('audio_line');

		line.addEventListener('click', (e)=>
			{
				if(!e.target.classList.contains('audio_progress') && progress == current_progress)
				{
					let max = line.offsetWidth;
					let cur = e.offsetX;

					let procent = cur/max;

					let toset = audio.duration * procent;
					audio.currentTime = toset;
				}
			});
		audio.src = 'common/files/' + path;
		time_td.innerHTML = '00:00';
		time_td.classList.add('audio_time');

		let progress = document.createElement('div');
		progress.classList.add('audio_progress');

		let img = document.createElement('img');
		img.classList.add('play_btn');
		img.src = 'static/img/play.png'
		img.addEventListener('click', () => 
			{
				let ms = img.src.split('/');

				if(ms[ms.length-1] == 'play.png') 
				{
					let buts = document.getElementsByClassName('play_btn');
					for(let i = 0; i<buts.length; i++)
					{
						buts[i].src = 'static/img/play.png';
					}
					audio.src = 'common/files/' + path;
					audio.play(); 
					img.src = 'static/img/pause.png';

					current_time_td = time_td;
					current_progress = progress;
					current_img = img;
				}
				else 
				{
					img.src = 'static/img/play.png'
					audio.pause();
				}
			});

		line.appendChild(progress);
		line_td.appendChild(line);

		pict_td.appendChild(img);

		tr.appendChild(pict_td);
		tr.appendChild(line_td);
		tr.appendChild(time_td);
		table.appendChild(tr);
		if(title)
		{
			let p = document.createElement('p');
			p.innerHTML = title;
			p.classList.add('fileTitle');
			div.appendChild(p);
		}
		div.appendChild(table);

		if(!isteacher)
		{
			let p = document.createElement('p');
			p.classList.add('student_name');
			p.innerHTML = name;
			// div.appendChild(p);
		}
		
		let datBlock = document.createElement('div');
		datBlock.classList.add('sms_date');
		datBlock.innerHTML = dat;
		div.appendChild(datBlock);

		if(data.reference){
			paintReferense(data,div);
		}
		let answerMesBlock = document.createElement('img');
		answerMesBlock.classList.add('answerMesBlock');
		answerMesBlock.src = 'static/img/answerMes.png'
		answerMesBlock.addEventListener('click',function(e){
			answerOnMes(id, isteacher);
		})
		
		if(isteacher){
			messageChees.style.justifyContent = "flex-end"
			messageChees.appendChild(answerMesBlock);
			messageChees.appendChild(div);
		}else{
			answerMesBlock.style.marginTop = "4vh";
			messageChees.appendChild(div);
			messageChees.appendChild(answerMesBlock);

		}
		layout.appendChild(messageChees);
	}

// Функция добавляет файл в чат
	function addFile(data, layout)
	{
		let id = data.mes_id;
		let isteacher = data.isteacher; 
		let name = data.firstname;
		let path = data.content;
		let dat = getTimeMes(data.dt);
		let title = data.title;

		removePict();

		let messageChees = document.createElement('div');
		messageChees.classList.add('messageChees');
		let div = document.createElement('div');
		div.id = 'mes' + id;
		if(isteacher) div.classList.add('right_message');
		else div.classList.add('left_message');

		let file = document.createElement('span');

		let a = document.createElement('a');
		let img = document.createElement('img');
		img.src = 'static/img/download.ico';
		img.classList.add('download_file');
		a.href = 'common/files/' +  path;
		a.classList.add('file_href');
		a.target = '_blank';
		a.appendChild(img);

		let filename = document.createElement('span');
		filename.classList.add('filename');
		let file_name = path;

		if(file_name.length > 7)
		{
			file_name = file_name.substr(0,10) + '...';
		}
		filename.innerHTML = file_name;
		filename.title = path;
		a.appendChild(filename);

		file.appendChild(a);
		if(title)
		{
			let p = document.createElement('p');
			p.innerHTML = title;
			p.classList.add('fileTitle');
			div.appendChild(p);
		}
		div.appendChild(file);

		if(!isteacher)
		{
			let p = document.createElement('p');
			p.classList.add('student_name');
			p.innerHTML = name;
			// div.appendChild(p);
		}

		let datBlock = document.createElement('div');
		datBlock.classList.add('sms_date');
		datBlock.innerHTML = dat;
		div.appendChild(datBlock);

		if(data.reference){
			paintReferense(data,div);
		}
		let answerMesBlock = document.createElement('img');
		answerMesBlock.classList.add('answerMesBlock');
		answerMesBlock.src = 'static/img/answerMes.png'
		answerMesBlock.addEventListener('click',function(e){
			answerOnMes(id, isteacher);
		})
		
		if(isteacher){
			messageChees.style.justifyContent = "flex-end"
			messageChees.appendChild(answerMesBlock);
			messageChees.appendChild(div);
		}else{
			answerMesBlock.style.marginTop = "4vh";
			messageChees.appendChild(div);
			messageChees.appendChild(answerMesBlock);

		}
		layout.appendChild(messageChees);
	}

// Функция добавляет видео в чат
	function addVideo(data, layout)
	{
		let id = data.mes_id;
		let isteacher = data.isteacher; 
		let name = data.firstname;
		let path = data.content;
		let dat = getTimeMes(data.dt);
		let title = data.title;

		removePict();

		let messageChees = document.createElement('div');
		messageChees.classList.add('messageChees');
		let div = document.createElement('div');
		div.id = 'mes' + id;
		if(isteacher) div.classList.add('right_message');
		else div.classList.add('left_message');

		let video = document.createElement('video');
		video.classList.add('chat_video');
		video.controls = 'true';
		video.src = 'common/files/' + path;
		if(title)
		{
			let p = document.createElement('p');
			p.innerHTML = title;
			p.classList.add('fileTitle');
			div.appendChild(p);
		}
		div.appendChild(video);

		if(!isteacher)
		{
			let p = document.createElement('p');
			p.classList.add('student_name');
			p.innerHTML = name;
			// div.appendChild(p);
		}

		let datBlock = document.createElement('div');
		datBlock.classList.add('sms_date');
		datBlock.innerHTML = dat;
		div.appendChild(datBlock);

		if(data.reference){
			paintReferense(data,div);
		}
		let answerMesBlock = document.createElement('img');
		answerMesBlock.classList.add('answerMesBlock');
		answerMesBlock.src = 'static/img/answerMes.png'
		answerMesBlock.addEventListener('click',function(e){
			answerOnMes(id, isteacher);
		})
		
		if(isteacher){
			messageChees.style.justifyContent = "flex-end"
			messageChees.appendChild(answerMesBlock);
			messageChees.appendChild(div);
		}else{
			answerMesBlock.style.marginTop = "4vh";
			messageChees.appendChild(div);
			messageChees.appendChild(answerMesBlock);

		}
		layout.appendChild(messageChees);
	}

//Функция доюавляет дз в чат
	function addHomeWork(data, layout){
		let id = data.mes_id;
		let isteacher = data.isteacher; 
		let name = data.firstname;
		let path = data.content;
		let dat = getTimeMes(data.dt);
		let title = data.title;

		removePict();
		let messageChees = document.createElement('div');
		messageChees.classList.add('messageChees');
		let div = document.createElement('div');
		div.id = 'mes' + id;
		if(isteacher) div.classList.add('right_message', 'testHref');

		let a = document.createElement('a');
		a.classList.add('hrefToTest');
		a.href = 'template?id=' + path;
		a.title = title;
		let span = document.createElement('span');
		span.innerHTML = 'Задание';
		let img = document.createElement('img');
		img.src = 'static/img/if_book-write.svg';
		a.appendChild(span);
		a.appendChild(img);
		div.appendChild(a);

		let datBlock = document.createElement('div');
		datBlock.classList.add('sms_date');
		datBlock.innerHTML = dat;
		div.appendChild(datBlock);

		if(data.reference){
			paintReferense(data,div);
		}
		let answerMesBlock = document.createElement('img');
		answerMesBlock.classList.add('answerMesBlock');
		answerMesBlock.src = 'static/img/answerMes.png'
		answerMesBlock.addEventListener('click',function(e){
			answerOnMes(id, isteacher);
		})
		
		if(isteacher){
			messageChees.style.justifyContent = "flex-end"
			messageChees.appendChild(answerMesBlock);
			messageChees.appendChild(div);
		}else{
			answerMesBlock.style.marginTop = "4vh";
			messageChees.appendChild(div);
			messageChees.appendChild(answerMesBlock);

		}
		layout.appendChild(messageChees);
	}

//Функция добавляет тест в чат
	function addTest(data, layout){
		let id = data.mes_id;
		let isteacher = data.isteacher; 
		let name = data.firstname;
		let path = data.content;
		let dat = getTimeMes(data.dt);
		let title = data.title;

		removePict();
		let messageChees = document.createElement('div');
		messageChees.classList.add('messageChees');
		let div = document.createElement('div');
		div.id = 'mes' + id;
		if(isteacher) div.classList.add('right_message', 'testHref');
		let a = document.createElement('a');
		a.classList.add('hrefToTest');
		a.href = 'creater?id=' + path;
		a.title =title;
		let span = document.createElement('span');
		span.innerHTML = 'Тест';
		let img = document.createElement('img');
		img.src = 'static/img/if_notepad.svg';
		a.appendChild(span);
		a.appendChild(img);
		div.appendChild(a);

		let datBlock = document.createElement('div');
		datBlock.classList.add('sms_date');
		datBlock.innerHTML = dat;
		div.appendChild(datBlock);

		if(data.reference){
			paintReferense(data,div);
		}
		let answerMesBlock = document.createElement('img');
		answerMesBlock.classList.add('answerMesBlock');
		answerMesBlock.src = 'static/img/answerMes.png'
		answerMesBlock.addEventListener('click',function(e){
			answerOnMes(id, isteacher);
		})
		
		if(isteacher){
			messageChees.style.justifyContent = "flex-end"
			messageChees.appendChild(answerMesBlock);
			messageChees.appendChild(div);
		}else{
			answerMesBlock.style.marginTop = "4vh";
			messageChees.appendChild(div);
			messageChees.appendChild(answerMesBlock);

		}
		layout.appendChild(messageChees);
	}

window.teach;
//Функция ответа на сообщение по id
function answerOnMes(id, isteacher){
	if(answerMes != -1){
			if(teach)
				document.getElementById('mes' + answerMes).style.backgroundColor = '#92a7d0'
			else document.getElementById('mes' + answerMes).style.backgroundColor = '#fff'
			if(document.getElementById('answer' + answerMes))
			msgs_block.removeChild(document.getElementById('answer' + answerMes));
	}
	if(answerMes == id){
		if(teach)
			document.getElementById('mes' + answerMes).style.backgroundColor = '#92a7d0'
		else document.getElementById('mes' + answerMes).style.backgroundColor = '#fff'
		if(document.getElementById('answer' + answerMes))
		msgs_block.removeChild(document.getElementById('answer' + answerMes));
		answerMes = -1;
	}else{
		answerMes = id
		let div = document.createElement('div');
		div.classList.add('refMesInBlock');
		div.id = 'answer' + id;
		div.innerHTML = `<div>${document.getElementById('mes' + id).innerHTML}</div>
		<img class="closeAns" src="static/img/close.svg" id="closeAns">`;
		msgs_block.appendChild(div);
		document.getElementById('closeAns').addEventListener('click', function(){{answerOnMes(id, isteacher)}})
		document.getElementById('mes' + id).style.backgroundColor = 'rgb(59, 170, 224)'
	}
	teach = isteacher;
}


//Функция распределения ответов по типам и их прикрепление
function paintReferense(data, layout){
	let div = document.createElement('div');
	div.classList.add('refer');
	switch(data.refType)
	{
		case 1: addRefSMS(data, div); 					break;
		case 2: addRefPicture(data, div); 				break;
		case 3: addRefAudio(data, div);				 	break;
		case 4: addRefFile(data, div); 					break;
		case 5: addRefVideo(data, div); 				break;
		case 7: addRefHomeWork(data, div);				break;
		case 8: addRefTest(data, div); 					break;
		default: console.log('Invalid chat type'); 		break;
	}
	if(data.isteacher === 0){
		div.style.marginLeft = 0;
	}
	div.addEventListener('click', function(e){
		gotoMes(data.reference)
	})
	layout.insertBefore(div, layout.firstChild)
}

function addRefSMS(data, layout){
	layout.innerHTML = `
		<p class="student_name select_name">${data.refSender}</p>
		<p class="sms">${data.refContent}</p>
	`	
}

function addRefPicture(data, layout){
	layout.innerHTML = `
		<p class="student_name select_name">${data.refSender}</p>
		${data.refTitle ? '<p class="fileTitle">' + data.refTitle + '</p>' : ''}
		<img class="chat_picture" src="common/files/${data.refContent}">
	`
}

function addRefAudio(data, layout){
	layout.innerHTML = `
		<p class="student_name select_name">${data.refSender}</p>
		${data.refTitle ? '<p class="fileTitle">' + data.refTitle + '</p>' : ''}
		<table>
			<tr>
				<td><img class="play_btn" src="static/img/play.png"></td>
				<td>
					<span class="audio_line">
						<div class="audio_progress"></div>
					</span>
				</td>
				<td class="audio_time">00:00</td>
			</tr>
		</table>
	`
}

function addRefFile(data, layout){
	layout.innerHTML = `
		<p class="student_name select_name">${data.refSender}</p>
		${data.refTitle ? '<p class="fileTitle">' + data.refTitle + '</p>' : ''}
		<div title="${data.refContent}">
			<a class="file_href">
				<img src="static/img/download.ico" class="download_file">
				<span class="filename">${data.refContent.length > 7 ? data.refContent.substr(0,10) + '...' : data.refContent}</span>
			</a>
		</div>
	`
}

function addRefVideo(data, layout){
	layout.innerHTML = `
		<p class="student_name select_name">${data.refSender}</p>
		${data.refTitle ? '<p class="fileTitle">' + data.refTitle + '</p>' : ''}
		<video class="chat_video" src="common/files/${data.refContent}"></video>
	`
}

function addRefHomeWork(data, layout){
	layout.innerHTML = `
		<p class="student_name select_name">${data.refSender}</p>
		${data.refTitle ? '<p class="fileTitle">' + data.refTitle + '</p>' : ''}
		<div class="hrefToTest">
			<img class="chat_picture" src="static/img/if_book-write.svg">
		</div>
	`
}

function addRefTest(data, layout){
	layout.innerHTML = `
		<p class="student_name select_name">${data.refSender}</p>
		${data.refTitle ? '<p class="fileTitle">' + data.refTitle + '</p>' : ''}
		<div class="hrefToTest">
			<img class="chat_picture" src="static/img/if_notepad.svg">
		</div>
	`
}

function gotoMes(ref){
	if(document.getElementById('mes'+ Number(ref))){
		document.getElementById('mes'+ Number(ref)).classList.add('selectMes');
			setTimeout(function(){
				document.getElementById('mes'+ Number(ref)).classList.remove('selectMes');
			}, 1000)
			block.scrollTo({
						    top: document.getElementById('mes'+ ref).offsetTop - 15,
						    behavior: "smooth"
						});
	}else{
		POST('/chat', `method=GET&&group_id=${current_group}&&mes_id=${window.mes_id}`, (req)=>{
			if(req.status === 200){
				getPartMes(req);
				gotoMes(ref);
			}
		});
	}
}

//Функция отправка тестов и домашки
	function TaskEnter(el){
		element = document.getElementById(el); 
		window.popup = document.createElement('div');
		popupHomework = []
		popupTests = [];
		popup.classList.add("popupWindow");
		popup.id = "popupWindow";
		if(files.children.length == 0){
			popup.style.bottom = "16.5vh";
		}
		if(files.children.length == 1 || files.children.length == 2){
			popup.style.bottom = "21.5vh";
		}
		if(files.children.length >= 3){
			popup.style.bottom = "26.5vh";
		}
		popup.innerHTML = 
		`
		<button class="popupButton" id="popup_test" onclick="buttonTest('popupWindow')">Тесты</button>
		<button class="popupButton" onclick="buttonHW('popupWindow')">Домашнее задание</button>
		`;

		let bg = document.createElement('div');
		bg.classList.add("bg");
		bg.id = 'bgTH'
		bg.addEventListener('click', (e)=>{
			ClsPopup();
		})
		element.appendChild(bg);
		element.appendChild(popup);

		document.getElementById('popup_test').click();
		
	}

//Фуннкция закрытия отправки дз/тестов
	function ClsPopup(){
		element.removeChild(document.getElementById('popupWindow'));
		element.removeChild(document.getElementById('bgTH'));
	}
//Функция вывода всех тестов
	function buttonTest(layoutid){
		let layout = document.getElementById(layoutid);
		layout.innerHTML = `
			<button class="popupButton selectButton" onclick="buttonTest('popupWindow')">Тесты</button>
			<button class="popupButton" onclick="buttonHW('popupWindow')">Домашнее задание</button>
		`;
		POST('/chat','method=GET-TEST&group_id='+current_group, function(req){
			let res = JSON.parse(req.response);

			let div = document.createElement('div');
				div.classList.add('popup_window_body');
				div.id = 'popupTasks'
			if(req.status === 200)
			{
				for (let i = 0; i < res.body.length; i++) 
				{
					popupTests[i] = res.body[i];
				div.innerHTML +=
				`
				<div class="Tester" onclick="EnterToServ(popupTests[${i}].test_id,popupTests[${i}].test_name,1)">
					${popupTests[i].test_name}
				</div>
				`;
				}
			}
			else div.innerHTML += '<div class="nopeTask">У вас нет тестов для этой группы!</div>';
			layout.appendChild(div)
			generateScroll('popupTasks', popup, {height:'calc(100% - 35px - 0.33vh)', width: '100%'}, 1, 1);
		});
	}

//Функция вывода всех дз
	function buttonHW(layoutid){
		let layout = document.getElementById(layoutid);
		layout.innerHTML = `
			<button class="popupButton" onclick="buttonTest('popupWindow')">Тесты</button>
			<button class="popupButton selectButton" onclick="buttonHW('popupWindow')">Домашнее задание</button>
		`;
		POST('/chat','method=GET-HOMEWORK&group_id='+current_group, function(req){
			let res = JSON.parse(req.response);
			let div = document.createElement('div');
			div.classList.add('popup_window_body');
			div.id = 'popupTasks'
			if(res.status === 200){
				if(res.body.length == 0) div.innerHTML += `<div class="nopeTask">У вас нет домашних заданий для этой группы!</div>`;
				else
				{
					for (let i = 0; i < res.body.length; i++) 
					{
						popupHomework[i] = res.body[i];
						div.innerHTML +=
						`
						<div class="Tester" onclick="EnterToServ(popupHomework[${i}].template_id, popupHomework[${i}].title, 2)">
							${popupHomework[i].title}
						</div>
						`
					}
				}
			}
			else div.innerHTML += `<div class="nopeTask">У вас нет домашних заданий для этой группы!</div>`;
			layout.appendChild(div);
			generateScroll('popupTasks', popup, {height:'calc(100% - 35px - 0.33vh)', width: '100%'}, 1, 1);
		});
	}

//Функция отправки на сервер данных о дз/тестов
	function EnterToServ(id, name, variant){	
		if(variant == 1)
		{
			POST('/result','method=TEST&&test='+id+'&&group='+current_group,function(req){
				if(req.status === 200){
					ws.send(JSON.stringify(
					{
						notice: 1,
						group_id: current_group,
						content: id,
						title: name,
						type: 8
					}));
				}
			});
		}
		else if(variant == 2)
		{
			POST('/result','method=HOMEWORK&&template='+id+'&&group='+current_group,function(req){
				if(req.status === 200)
				{
					ws.send(JSON.stringify(
					{
						notice: 1,
						group_id: current_group,
						content: id,
						title: name,
						type: 7
					}));
				}
				else console.log(JSON.parse(req.response));
			});
		}
		ClsPopup();

		block.scrollTo(0, block.scrollHeight);
	}

	let send_message = document.getElementsByClassName('send_message')[0];
	function moveInput(){
		if(files.children.length == 0)
		{
			msgs_block.style.height = "82%";
			send_message.style.bottom = "10.5vh";
			document.getElementsByClassName('buttons')[0].style.bottom = "2vh";
		}
		if(files.children.length == 1 || files.children.length == 2 )
		{
			document.getElementsByClassName('buttons')[0].style.bottom = "7vh";
			msgs_block.style.height = "76%";
			send_message.style.bottom = "15vh";
		}
		if(files.children.length >= 3)
		{
			document.getElementsByClassName('buttons')[0].style.bottom = "12vh";
			msgs_block.style.height = "70%";
			send_message.style.bottom = "20vh";
		}
	}
		
	function animateMic()
	{
		if(activeMic == false)
		{
			value = text.value;
			text.value = '';
			microfon.classList.add('animateMic');
			activeMic = true;
			text.placeholder = '0'+minute + ':0' + seconds;
			text.disabled = true;
			timer = setInterval(function()
			{
				seconds++;
				if(seconds >= 60) {minute++; seconds = 0}
				if(seconds < 10) intSeconds = '0' + seconds; 
				else intSeconds = seconds;
				if(minute < 10) intMinute = '0' + minute; 
				else intMinute = minute
				text.placeholder = intMinute + ':' + intSeconds;
			},1000)
		}
		else
		{
			clearInterval(timer);
			minute = 0;
			seconds = 0;
			microfon.classList.remove('animateMic');
			activeMic = false;
			text.disabled = false;
			text.placeholder = "Введите сообщение";
			text.value = value;
		}
	}	

//Скролл прокруткой в чате
	block.onscroll = function(){
		if ((block.scrollHeight - block.scrollTop) > block.clientHeight + 250) 
		{
			document.getElementById('bottom_arrow').style.bottom = '5%';
			document.getElementById('bottom_arrow').style.opacity = '1';
			document.getElementById('bottom_arrow').style.visibility = 'visible';
		}
		else 
		{
			document.getElementById('bottom_arrow').style.bottom = '-15%';
			document.getElementById('bottom_arrow').style.opacity = '0';
			document.getElementById('bottom_arrow').style.visibility = 'hidden';
		}

		if (block.scrollTop < 200 && window.scrollFlag === true) 
		{
			window.scrollFlag = false;
			POST('/chat', `method=GET&&group_id=${current_group}&&mes_id=${window.mes_id}`, getPartMes); 
		}
		
		if(block.clientHeight <  msgs.clientHeight && scrollPerson == false){
			if(blockVSbody != block.clientHeight / msgs.clientHeight) blockVSbody = block.clientHeight / msgs.clientHeight;
			scrollBar.style.height = (block.clientHeight * blockVSbody) + 'px';
			let style;
			let marginTop;
			StudentsCount = 0;
			for (var i = 0; i < msgs.children.length; i++) 
			{	
				StudentsCount += msgs.children[i].clientHeight;
				style = window.getComputedStyle(msgs.children[i]);
				marginTop = style.getPropertyValue('margin-top'); 
				StudentsCount += Number(marginTop.substring(0, marginTop.length - 2))
			}
			msgsChildren = msgs.children.length;
			StudentsCount /= block.clientHeight;
			scrollBar.style.top = (block.scrollTop/StudentsCount) + 'px';
		}
	}
	//Скролл захватом скроллбара в чате
	function personalScroll(){
		scrollPerson = true;
		document.onmousedown = function(){return false};
		let div = document.createElement('div');
		let rect = block.getBoundingClientRect();
		div.style.width = '100vw';
		div.style.top = rect.top + 'px';
		div.style.bottom = rect.bottom + 'px';
		div.style.height = rect.height + 'px';
		div.style.background = "transparent";
		div.style.position = 'absolute';
		div.id='scrollInvise';
		div.style.zIndex = 10000;
		document.getElementsByClassName('wrapper')[0].appendChild(div);
			document.onmousemove = function(e){
				if(blockVSbody != block.clientHeight / msgs.clientHeight) blockVSbody = block.clientHeight / msgs.clientHeight;
				scrollBar.style.height = (block.clientHeight * blockVSbody) + 'px';
				scrollBar.style.top = (block.scrollTop/StudentsCount) + 'px';
				if(e.target.id == 'scrollInvise')
				{
					let y = e.offsetY - (scrollBar.clientHeight/2);
					block.scrollTop = StudentsCount * y;
				}
				else if(e.clientY <= rect.top) block.scrollTop = 0;	
				else if(e.clientY > rect.top)  block.scrollTop = msgs.offsetHeight;
			}
		document.onmouseup = function(){
			document.onmousedown = function(){scrollPerson = false;};
			document.onmousemove = function(){scrollPerson = false;};
			document.getElementsByClassName('wrapper')[0].removeChild(div);
		}
	}

function getTimeMes(date){
	date = new Date(date);
	let now = new Date();
	let dat = '';
	if(date.getFullYear() == now.getFullYear() && date.getMonth() == now.getMonth()){
		if(date.getDate() == now.getDate())
			dat += 'Сегодня '
		else if(date.getDate() == now.getDate() - 1)
			dat += 'Вчера '
		else{
		if(date.getFullYear != new Date().getFullYear)
			dat += date.getFullYear() + '.';
		dat += date.getMonth() + '.' + date.getDate() + ' ';
	}
	}
		if(date.getHours() < 10)
			dat += '0' + date.getHours() + ':'; 
		else dat += date.getHours() + ':';  
		if(date.getMinutes() < 10)
			dat += '0' + date.getMinutes(); 
		else dat += date.getMinutes();

	return dat;
}
function createLoad(){
  let bg = document.createElement('img')
  bg.src = "static/img/2.svg";
  bg.id = 'img_load';
  bg.classList.add('loadIMG')
  document.querySelector('.box').appendChild(bg);
}

function deleteLoad(){
	if(document.querySelector('.box') && document.getElementById('img_load'))
  	document.querySelector('.box').removeChild(document.getElementById('img_load'))
}