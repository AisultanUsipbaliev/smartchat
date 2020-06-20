function getHomeWorkPage(id)
{
	if(id)	homeWorkBlock(id);
	else	homeWorkListBlock();
}
 
function homeWorkListBlock()  
{
	content.innerHTML = `   <div class="hw-list" id="bodyHWs">
								<div class="hw-header" id="hw_header">
									<div class="hw-header__text">Курс</div>
									<div class="hw-header__text">Статус</div>
									<div class="hw-header__text">Дата</div>
									<div class="hw-header__text">Оценка</div>
									<div class="hw-header__text">Действия</div>
								</div>
								<div class="hw-body" id="hw_list"></div>
							</div>`;

	let hw_list = document.getElementById('hw_list');
	let div = document.createElement('div');

	POST('/homework', 'method=GET', function(res, status) 
	{
		if (status == 200)
			for (var i = 0; i < res.body.length; i++) 
				createHomeWorkListBlockRow(res.body[i], div);
		else 
			div.innerHTML = `<div class="nopeTask">У вас нет заданий</div>`;
	});
	hw_list.appendChild(div);
	generateScroll('hw_header', document.getElementById('bodyHWs'),{height: '12%', width: '100%'}, 1, 2);
	generateScroll('hw_list', document.getElementById('bodyHWs'),{height: '88%', width: '100%'}, 1, 2);
}

function createHomeWorkListBlockRow(data, layout) 
{
	let div = document.createElement('div');

	div.classList.add('hw-body__row');

	div.innerHTML =`<div class="hw-body__text">${data.rate_name}</div>
					${data.filepath ? '<div class="hw-body__text" style="color: lightgreen;">Выполнено</div>'
									: '<div class="hw-body__text" style="color: red;">Не выполнено</div>'}
					<div class="hw-body__text">${getDateFormatDMY(data.dt)}</div>
					${data.score 	? '<div class="hw-body__text"> ' +data.score+ '</div>'
								 	: '<div class="hw-body__text"> - </div>'}
					<div class="hw-body__text">
						<div class="hw-body__button" id="hw_${data.id}">Просмотр</div>
					</div>`;
	 
	div.querySelector('#hw_'+data.id).addEventListener('click', (e)=>{ goto('homework/'+data.template); });
	layout.appendChild(div);
}

function homeWorkBlock(template)
{
	content.innerHTML = 
	`<div class="home-work">
		<div class="home-work__header">
			<div>Курс: English</div>
		</div>
		<div class="home-work__body">
			<input type="file" id="file_input" style="display: none;">
			<div class="home-work__task">
				<div class="home-work__text" id="task"></div>
			</div>
			<div class="home-work__template" id="template"></div>
			<div class="home-work__footer" id="footer"></div>
		</div>
	</div>`;

	document.getElementById('file_input').addEventListener('change', function() {
		let files = this.files[0];
		uploadFile('/homework', files, {method: 'upload', template: template}, function(req){
			goto('homework');
		});
		this.value = '';
	})

	let layout = document.getElementById('template');

	POST('/homework', `method=CONTENT&&temp_id=${template}`, (res, stat)=>
		{
			if(stat == 200)
				homeWorkBlockTemplate(res, layout);
			else 
				getNotFoundPage();
		});
}

function homeWorkBlockTemplate(res, layout)
{
	let imgFlag = true;
	let videoFlag = true;
	let audioFlag = true;
	let fileFlag = true;

	for (var i = 0; i < res.body.length; i++) 
	{
		switch (res.body[i].type)
		{
			case 1:
				document.getElementById('task').innerHTML = res.body[i].content;
			break;
			case 2:
				if (imgFlag) 
				{
					let imgTemp = document.createElement('div');
					imgTemp.classList.add('temp');
					imgTemp.id = 'img_content';
					layout.appendChild(imgTemp);
					imgFlag = false;
				}
				let img_content = document.getElementById('img_content');
				createImgContent(res.body[i].content, img_content);
			break;
			case 5:
				if (videoFlag) 
				{
					let videoTemp = document.createElement('div');
					videoTemp.classList.add('temp');
					videoTemp.id = 'video_content';
					layout.appendChild(videoTemp);
					videoFlag = false;
				}
				let video_content = document.getElementById('video_content');
				createVideoContent(res.body[i].content, video_content)
			break;
			case 3:
				if (audioFlag) 
				{
					let audioTemp = document.createElement('div');
					audioTemp.classList.add('temp');
					audioTemp.id = 'audio_content';
					layout.appendChild(audioTemp);
					audioFlag = false;
				}
				let audio_content = document.getElementById('audio_content');
				createAudioContent(res.body[i].content, audio_content)
			break;
			case 4:
				if (fileFlag) 
				{
					let fileTemp = document.createElement('div');
					fileTemp.classList.add('temp');
					fileTemp.id = 'file_content';
					layout.appendChild(fileTemp);
					fileFlag = false;
				}
				let file_content = document.getElementById('file_content');
				createFileContent(res.body[i].content, file_content)
			break;
		}
	}
	let footer = document.getElementById('footer');
	
	
	if(!res.results.filePath)
	{
		sendButton = document.createElement('div');
		sendButton.classList.add('home-work__button');
		sendButton.innerHTML = 'Отправить ответ';
		sendButton.addEventListener('click', (e)=>{ document.getElementById('file_input').click(); })
		
		footer.appendChild(sendButton);
	}
	else 
	{
		viewButton = document.createElement('a');
		viewButton.classList.add('home-work__button');
		viewButton.href = '/common/files/' + res.results.filePath;
		viewButton.innerHTML = 'Посмотреть ответ';

		footer.appendChild(viewButton);
	}
}

function createImgContent(content, layout) {
	let temp = document.createElement('div');
	temp.classList.add('temp');

	let imgContainer = document.createElement('div');
	imgContainer.classList.add('temp__img');

	let img = document.createElement('img');
	img.src = '/common/files/'+content;

	imgContainer.appendChild(img);
	temp.appendChild(imgContainer);
	layout.appendChild(temp);
}

function createVideoContent(content, layout) {
	let temp = document.createElement('div');
	temp.classList.add('temp');

	let videoContainer = document.createElement('div');
	videoContainer.classList.add('temp__video');

	let video = document.createElement('video');
	video.src = '/common/files/'+content;
	video.controls = 'controls';

	videoContainer.appendChild(video);
	temp.appendChild(videoContainer);
	layout.appendChild(temp);
}

function createAudioContent(content, layout) {
	let temp = document.createElement('div');
	temp.classList.add('temp');

	let audioContainer = document.createElement('div');
	audioContainer.classList.add('temp__audio');

	let audio = document.createElement('audio');
	audio.src = '/common/files/'+content;
	audio.controls = 'controls';

	audioContainer.appendChild(audio);
	temp.appendChild(audioContainer);
	layout.appendChild(temp);
}

function createFileContent(content, layout) {
	let temp = document.createElement('div');
	temp.classList.add('temp');

	let fileContainer = document.createElement('div');
	fileContainer.classList.add('temp__file');

	let file = document.createElement('div');
	file.classList.add('tempfile');

	let fileImgContainer = document.createElement('div');
	fileImgContainer.classList.add('tempfile__img');

	let img = document.createElement('img');
	img.src = '/img/file.svg';

	let fileNameContainer = document.createElement('div');
	fileNameContainer.classList.add('tempfile__name');

	let fileName = document.createElement('a');
	fileName.href = '/common/files/'+content;
	fileName.download = '';
	fileName.innerHTML = content

	fileImgContainer.appendChild(img);
	file.appendChild(fileImgContainer);

	fileNameContainer.appendChild(fileName);
	file.appendChild(fileNameContainer);
	
	fileContainer.appendChild(file);
	temp.appendChild(fileContainer);
	layout.appendChild(temp);
}
