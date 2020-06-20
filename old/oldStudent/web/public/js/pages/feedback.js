function getFeedbackPage()
{
	content.innerHTML =
    `<div class="main_feedback">
		<textarea id="feedback_input" autofocus placeholder="Возникли трудности в работе с системой? Нашли ошибку? Сообщите нам." type="text"></textarea>
		<i class="fas fa-times" onclick="deleteImg()" id='delete_fdbck_img' title="Удалить изображение"></i>
		<input type="file" id = 'file'  onchange="uploadF()" style="display: none;">

		<div style="width: 90%;" id="file_container"><p class="load_screen" onclick="addContent()">Загрузить скриншот</p></div>
		<button class="feedback_btn" onclick="sendReport()">Отправить</button>
	</div>`;
	let input = content.querySelector('#feedback_input');
	input.addEventListener('change', function(){
		input.style.boxShadow = "0 0 5px transparent";
	});;
} 

function addContent() {	 
	document.getElementById('file').click();
};

function uploadF()
{
	let file = document.getElementById('file').files[0];
	sendFile('/sendFile', file, (response)=>
	{
		window.feedbackFile = response;
		let img = document.createElement('img');
		img.src = 'common/files/'+response;
		img.classList.add('img_feedback');
		document.getElementById('file_container').innerHTML='';
		document.getElementById('delete_fdbck_img').style.display = "block";
		document.getElementById('file_container').appendChild(img);
	});
	document.getElementById('file').value = '';
}

function getFileType(file)
{
	let type = file.type.split('/')[0];
	switch(type)
	{
	  case 'image':   return 2;
	  case 'audio':   return 3;
	  case 'video':   return 5;
	  default:        return 4;
	}
}

function deleteImg(){
	document.getElementById('file_container').innerHTML='<p class="load_screen" onclick="addContent()">Загрузить скриншот</p>';
	document.getElementById('delete_fdbck_img').style.display = "none";
}

function sendReport() {
	let container = document.getElementById('file_container');
	let input =	document.getElementById('feedback_input');
	
	if(input.value == '')	{input.style.boxShadow = "0 0 5px red"; return;}
	if(!window.feedbackFile) window.feedbackFile = '';
	let file = window.feedbackFile;
	let comment = input.value;

	POST('/feedback', `method=REPORT&&file=${file}&&comment=${comment}`, (res, stat) =>
		{
			if(stat == 200) thanksForFeedback();
		});

	input.value = '';
	document.getElementById('file_container').innerHTML='<p class="load_screen" onclick="addContent()">Загрузить скриншот</p>';
	document.getElementById('delete_fdbck_img').style.display = "none";
}