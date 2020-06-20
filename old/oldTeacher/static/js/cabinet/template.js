POST('/template', 'method=GET-PATH', createNavigate); 
function createNavigate(res) 
{
	let layout = document.getElementById('nav_template');
	let result = JSON.parse(res.response).mas;
	for (let i = 0; i < result.length; i++) 
	{
		layout.innerHTML += 
		`
			<div class="rate-container">
				<div class="rate" onclick="showLevel(${result[i].rate_id}, ${result[i].level.length})">
					<div id="rate_img_${result[i].rate_id}" class="rate__img" style="transform: rotate(0deg);">
						<img src="static/img/playbutton.svg">
					</div>
					<div>${result[i].rate_name}</div>	
				</div>
				<div class="level-container" id="level_container_${result[i].rate_id}"></div>
			</div>
		`; 
		let levelLayout = document.getElementById(`level_container_${result[i].rate_id}`);
		createLevelLayout(result[i].rate_id, result[i].rate_name, result[i].level, levelLayout);
	}
	generateScroll('nav_template', document.getElementsByClassName('nav-temp')[0],{width: '100%', height: '68.6vh'})
}

function showLevel(rate_id, length) 
{
	let element = document.getElementById(`rate_img_${rate_id}`);
	let layout = document.getElementById(`level_container_${rate_id}`);
	if (parseInt(layout.style.minHeight)) 	animateNavigate(length*4, layout, element, false);
	else 									animateNavigate(length*4, layout, element, true);
}

function createLevelLayout(rate_id, rate_name, data, layout) 
{
	for (let i = 0; i < data.length; i++) 
	{
		layout.innerHTML +=
		`
			<div class="level" onclick="showLesson(${rate_id}, ${data[i].lvl_id}, ${data[i].lessons})">
				<div id="level_img_${rate_id}_${data[i].lvl_id}" class="level__img" style="transform: rotate(0deg);">
					<img src="static/img/playbutton.svg">
				</div>
				<div>${data[i].lvl_name}</div>
			</div>
			<div class="lesson" id="lesson_container_${rate_id}_${data[i].lvl_id}"></div>
		`;
		let lessonLayout = document.getElementById(`lesson_container_${rate_id}_${data[i].lvl_id}`);
		createLessonLayout(rate_id, rate_name, data[i].lvl_id, data[i].lvl_name, data[i].lessons, lessonLayout);
	}	
}

function showLesson(rate_id, lvl_id, length) 
{
	let element = document.getElementById(`level_img_${rate_id}_${lvl_id}`);
	let layout = document.getElementById(`lesson_container_${rate_id}_${lvl_id}`);
	if (parseInt(layout.style.minHeight)) 	animateNavigate(length*4, layout, element, false);
	else 									animateNavigate(length*4, layout, element, true);
}

function createLessonLayout(rate_id, rate_name, lvl_id, lvl_name, data, layout) 
{
	for (var i = 1; i < data+1; i++) 
		layout.innerHTML +=
		`
			<div class="lesson__name" onclick="getTemplate(${rate_id}, '${rate_name}', ${lvl_id}, '${lvl_name}', ${i})">Урок ${i}</div>
		`;
}
 
function getTemplate(rate_id, rate_name, lvl_id, lvl_name, lesson) 
{
	let pathContainer = document.getElementById('template-path');
	POST(`/template`, `method=GET&rate_id=${rate_id}&lvl_id=${lvl_id}&lesson=${lesson}`, (req)=>
	{
		let res = JSON.parse(req.response);
		pathContainer.innerHTML = `	<div>/${rate_name}/${lvl_name}/${lesson}</div>
									${res.access 
										? '<div class="link" onclick="addModal('+rate_id+', '+lvl_id+', '+lesson+')">добавить шаблон</div>' 
										: ''
									}
								  `;
		let container = document.getElementById('template-list');
		if (res.status == 200) 
		{
			container.innerHTML = '';
			for (var i = 0; i < res.template.length; i++) 
				createTemplate(res.template[i], res.access, false, i+1);
			if(document.getElementById('template-list').children.length >4) {
				console.log(document.getElementById('template-list').lastChild.children[0].lastChild)
				document.getElementById('template-list').lastChild.children[0].lastChild.style.top = "-23vh";
			}
		}
		else container.innerHTML ='<div id="nope_template" class="nopeTemplate">Шаблоны отсутствуют</div>';
		generateScroll('template-list',document.getElementById('template-container'),{height:'68.6vh', width:"auto"}, 1,1);
	});
}

function createTemplate(data, access, edited, i) 
{
	let order = parseInt(i);

	let layout = document.getElementById('template-list');
	let template_block = null;
	if (edited) 
	{
		if (data.content.length>0) 
		{
			template_block = document.getElementById(`template_${data.temp_id}`);
			template_block.innerHTML = '';

			createTemplateHeaderBlock(data, access, template_block, order);
			createTemplateBodyBlock(data, template_block);
		}
		else 
		{
			document.getElementById(`template_${data.temp_id}`).remove();
			if (layout.children.length == 0) 
				layout.innerHTML ='<div id="nope_template" class="nopeTemplate">Шаблоны отсутствуют</div>';
		}
	} 
	else 
	{
		if (data.content.length>0) 
		{
			if (document.getElementById('nope_template')) document.getElementById('nope_template').remove();
			template_block = document.createElement('div');
			template_block.classList.add('template');
			template_block.id = 'template_'+data.temp_id;
			template_block.style.order = data.order;

			layout.appendChild(template_block);

			createTemplateHeaderBlock(data, access, template_block, order);
			createTemplateBodyBlock(data, template_block);
		}
	}
}

function createTemplateHeaderBlock(data, access, layout, count)
{	
	let header = document.createElement('div');
		header.classList.add('template__header');

	if (access) createSettingIcon(data.temp_id, count, header);
	if (data.dz == 1) createHomeworkIcon(header, true);
	else createHomeworkIcon(header, false);
	if (access) createSettingDropdown(data.temp_id, data.content, data.dz, header);

	layout.appendChild(header);

	if (access) window.onclick = closeSettingDropdown;
}

function createSettingIcon(temp_id, order, layout) {
	let div = document.createElement('div');
		div.classList.add('setting-img');
		div.id = 'setting_dropdown_icon_'+temp_id;
		div.addEventListener('click', function (e) {
			settingDropdown(temp_id);
		})
		
	let img = document.createElement('img');
		img.classList.add('rotateGear');
		img.src = 'static/img/gear.svg';

	let h1 = document.createElement('h1');
		h1.classList.add('count_template');
		h1.innerHTML = order-1;

	div.appendChild(img);
	div.appendChild(h1);
	layout.appendChild(div);
}

function createHomeworkIcon(layout, flag) {
	let div = document.createElement('div');
	if (flag) 
	{
		div.classList.add('setting-img', 'setting-img_cursor-auto', 'bg-color-green');
		let img = document.createElement('img');
			img.src = 'static/img/homeWorkWhite.png';
		div.appendChild(img);
	} 
	layout.appendChild(div);
}

function createSettingDropdown(temp_id, content, dz, layout) {
	let div = document.createElement('div');
		div.classList.add('setting-template', 'hidden');
		div.id = 'settingDropdown_'+temp_id;

	let reverceUpButton = document.createElement('div');
		reverceUpButton.classList.add('setting-template__link');
		reverceUpButton.innerHTML = 'Наверх';
		reverceUpButton.addEventListener('click', function (e) {
			reverceUp(temp_id);
		})

	let editModalButton = document.createElement('div');
		editModalButton.classList.add('setting-template__link');
		editModalButton.innerHTML = 'Изменить';
		editModalButton.addEventListener('click', function(e) {
			editModal(content, temp_id, dz);
		})

	let deleteTemplateButton = document.createElement('div');
		deleteTemplateButton.classList.add('setting-template__link');
		deleteTemplateButton.innerHTML = 'Удалить';
		deleteTemplateButton.addEventListener('click', function(e) {
			deleteTemplate(temp_id);
		})

	let reverceDownButton = document.createElement('div');
		reverceDownButton.classList.add('setting-template__link');
		reverceDownButton.innerHTML = 'Вниз';
		reverceDownButton.addEventListener('click', function(e) {
			reverceDown(temp_id);
		})

	div.appendChild(reverceUpButton);
	div.appendChild(editModalButton);
	div.appendChild(deleteTemplateButton);
	div.appendChild(reverceDownButton);

	layout.appendChild(div);
}

function settingDropdown(temp_id) 
{
	let template_container = document.getElementById('template-list');
	for (var i = 0; i < template_container.children.length; i++) 
	{
		if(!template_container.children[i].children[0].children[2].classList.contains('hidden'))
			template_container.children[i].children[0].children[2].classList.add('hidden');
		else
			if (template_container.children[i].children[0].children[2].id == 'settingDropdown_'+temp_id) 
				template_container.children[i].children[0].children[2].classList.toggle('hidden');
	}
}

function closeSettingDropdown(e)
{
	let template_container = document.getElementById('template-list');
	for (var i = 0; i < template_container.children.length; i++) 
		if (template_container.children[i].children.length>0)
			if(!template_container.children[i].children[0].children[2].classList.contains('hidden'))
				if (template_container.children[i].children[0].children[0].children[0].className != e.target.className) 
					template_container.children[i].children[0].children[2].classList.add('hidden');
}

function createTemplateBodyBlock(data, layout) 
{
	let div = document.createElement('div');
		div.classList.add('template__body');
		div.id = 'template_body_'+data.temp_id;

	layout.appendChild(div);

	layout = document.getElementById(`template_${data.temp_id}`).children[1];
	for (var i = 0; i < data.content.length; i++) 
	{
		switch(data.content[i].type) 
		{
			case 1: createTextContentContainer(data.temp_id, data.content[i], layout); 		break;
			case 2: createImgContentContainer(data.temp_id, data.content[i], layout); 		break;
			case 3: createAudioContentContainer(data.temp_id, data.content[i], layout); 	break;
			case 4: createFileContentContainer(data.temp_id, data.content[i], layout);  	break;
			case 5: createVideoContentContainer(data.temp_id, data.content[i], layout);  	break;
		}
	}
}

function createTextContentContainer(temp_id, data, layout) 
{
	let element;

	if (document.getElementById(`content_${temp_id}_${data.type}`)) 
		element = document.getElementById(`content_${temp_id}_${data.type}`);
	else 
	{
		element = document.createElement('div');
		element.classList.add('text-content');
		element.style.order = 1;
		element.id = `content_${temp_id}_${data.type}`;
	}

	let textBlock = document.createElement('div');
		textBlock.classList.add('text-block');
		textBlock.innerHTML = data.content;

	element.appendChild(textBlock);
	layout.appendChild(element);
}

function createImgContentContainer(temp_id, data, layout) 
{
	let element;

	if (document.getElementById(`content_${temp_id}_${data.type}`)) 
		element = document.getElementById(`content_${temp_id}_${data.type}`);
	else 
	{
		element = document.createElement('div');
		element.classList.add('img-content');
		element.style.order = 2;
		element.id = `content_${temp_id}_${data.type}`;
	}

	let imgBlock = document.createElement('div');
		imgBlock.classList.add('img-block');

	let imgBlockImage = document.createElement('img');
		imgBlockImage.src = '/common/files/'+data.content;

	let modal = document.getElementById('myModal');
	let popUpImg = document.getElementById("img01");
	let captionText = document.getElementById("caption");

	imgBlockImage.addEventListener('click', function(e) {
		document.getElementById('img01').classList.remove('modal-content-backzoom');
		document.getElementById('caption').classList.remove('backzoom');
		document.getElementById('img01').classList.add('modal-content');
		document.getElementById('caption').classList.add('caption');
	    modal.style.display = "block";
	    popUpImg.src = this.src;
	    captionText.innerHTML = this.alt;
	});

	modal.addEventListener('click', function(e) {

		document.getElementById('img01').classList.remove('modal-content');
		document.getElementById('caption').classList.remove('caption');
		document.getElementById('img01').classList.add('modal-content-backzoom');
		document.getElementById('caption').classList.add('backzoom');
		setTimeout(()=>{ modal.style.display = "none"; }, 400);
	});

	imgBlock.appendChild(imgBlockImage);
	element.appendChild(imgBlock);
	layout.appendChild(element);
}

function createAudioContentContainer(temp_id, data, layout) 
{
	let element;

	if (document.getElementById(`content_${temp_id}_${data.type}`)) 
		element = document.getElementById(`content_${temp_id}_${data.type}`);
	else 
	{
		element = document.createElement('div');
		element.classList.add('video-content');
		element.style.order = 3;
		element.id = `content_${temp_id}_${data.type}`;
	}

	let audioBlock = document.createElement('div');
		audioBlock.classList.add('audio-block');

	let audioBlockAudio = document.createElement('audio');
		audioBlockAudio.src = '/common/files/'+data.content;

	let attr = document.createAttribute('controls');

	audioBlockAudio.setAttributeNode(attr);

	audioBlock.appendChild(audioBlockAudio);
	element.appendChild(audioBlock);
	layout.appendChild(element);
}

function createFileContentContainer(temp_id, data, layout) 
{
	let element;

	if (document.getElementById(`content_${data.temp_id}_${data.type}`)) 
		element = document.getElementById(`content_${temp_id}_${data.type}`);
	else 
	{
		element = document.createElement('div');
		element.classList.add('file-content');
		element.style.order = 4;
		element.id = `content_${temp_id}_${data.type}`;
	}

	let fileBlock = document.createElement('div');
		fileBlock.classList.add('file-block');

	let fileBlockImg = document.createElement('div');
		fileBlockImg.classList.add('file-img');

	let fileImg = document.createElement('img');
		fileImg.src = 'static/img/file.svg';

	let fileName = document.createElement('div');
		fileName.classList.add('file-name');

	let fileLink = document.createElement('a');
		fileLink.href = '/common/files/'+data.content;

	let fileNewName = data.content.split('/');
		fileName.title = fileNewName[fileNewName.length-1];
		fileNewName = fileNewName[fileNewName.length-1].slice(0, 15)+'...';

	fileLink.innerHTML = fileNewName;

	let attr = document.createAttribute('download');

	fileLink.setAttributeNode(attr);

	fileBlockImg.appendChild(fileImg);
	fileBlock.appendChild(fileBlockImg)
	fileName.appendChild(fileLink);
	fileBlock.appendChild(fileName)
	element.appendChild(fileBlock);
	layout.appendChild(element);
}

function createVideoContentContainer(temp_id, data, layout) 
{
	let element;

	if (document.getElementById(`content_${temp_id}_${data.type}`)) 
		element = document.getElementById(`content_${temp_id}_${data.type}`);
	else 
	{
		element = document.createElement('div');
		element.classList.add('video-content');
		element.style.order = 5;
		element.id = `content_${temp_id}_${data.type}`;
	}

	let videoBlock = document.createElement('div');
		videoBlock.classList.add('video-block');

	let videoBlockChild = document.createElement('div');

	let videoBlockVideo = document.createElement('video');
		videoBlockVideo.src = '/common/files/'+data.content;

	let attr = document.createAttribute('controls');

	videoBlockVideo.setAttributeNode(attr);

	videoBlockChild.appendChild(videoBlockVideo);
	videoBlock.appendChild(videoBlockChild);
	element.appendChild(videoBlock);
	layout.appendChild(element);
}

function deleteTemplate(temp_id) {
	let layout = document.getElementById(`template_${temp_id}`);
	POST('/template', 'method=DELETE&temp_id='+temp_id, function(req) 
	{
		let res = JSON.parse(req.response);
		
		if (res.status == 200) 	
		{
			layout.remove();

			let parentLayout = document.getElementById('template-list');

			for (var i = 0; i < parentLayout.children.length; i++) 
			{
				let countList = parentLayout.children[i].children[0].children[0].children[1];
				countList.innerHTML = i+1;
			}
			if (parentLayout.children.length == 0) 
				parentLayout.innerHTML ='<div id="nope_template" class="nopeTemplate">Шаблоны отсутствуют</div>';
		}
		else console.log(res);
	})
}
	
function appendContent(data, type) 
{
	let uniqID = generateQuickGuid();

	let contentData = {
		uniqID: uniqID,
		type: type,
		content: data
	}

	window.newContent.push(contentData);

	switch(type) 
	{
		case 2: addImgContent('/common/files/'+data, uniqID);		break;
		case 3: addAudioContent('/common/files/'+data, uniqID);		break;
		case 4: addFileContent('/common/files/'+data, uniqID);		break;
		case 5: addVideoContent('/common/files/'+data, uniqID);		break;
	}
}

function addTextContent(text) 
{
	let modalText = document.getElementById('modalText');
	if (text) 		modalText.value = text.trim();
	else 			modalText.value = '';
}

function addImgContent(path, uniqID) 
{
	let modalImgHeader = document.getElementById('modalImgHeader');
		modalImgHeader.style.display = 'flex';

	let modalImg = document.getElementById('modalImg');
		modalImg.style.display = 'flex';

	let deleteImgBlock = document.createElement('div');
		deleteImgBlock.classList.add('modal__close');

	let deleteImg = document.createElement('img');
		deleteImg.src = '/static/img/close.svg';

	let modalImgBlock = document.createElement('div');
		modalImgBlock.classList.add('modal-img__block');
		modalImgBlock.id = 'content-'+uniqID;

	let image = document.createElement('img');
		image.src = path;

	deleteImgBlock.appendChild(deleteImg);
	modalImgBlock.appendChild(deleteImgBlock);
	modalImgBlock.appendChild(image);
	modalImg.appendChild(modalImgBlock);
	
	deleteImgBlock.addEventListener('click', function(e) {
		deleteContent(uniqID);
		modalImgBlock.remove()
	});
}

function addAudioContent(path, uniqID) 
{
	let modalAudioHeader = document.getElementById('modalAudioHeader');
		modalAudioHeader.style.display = 'flex';

	let modalAudio = document.getElementById('modalAudio');
		modalAudio.style.display = 'flex';

	let deleteAudioBlock = document.createElement('div');
		deleteAudioBlock.classList.add('modal__close');

	let deleteAudio = document.createElement('img');
		deleteAudio.src = '/static/img/close.svg';

	let modalAudioBlock = document.createElement('div');
		modalAudioBlock.id = 'content-'+uniqID;
		modalAudioBlock.classList.add('modal-audio__block');

	let audio = document.createElement('audio');
		audio.src = path;

	let attr = document.createAttribute('controls');
	
	audio.setAttributeNode(attr);

	deleteAudioBlock.appendChild(deleteAudio);
	modalAudioBlock.appendChild(deleteAudioBlock);
	modalAudioBlock.appendChild(audio);
	modalAudio.appendChild(modalAudioBlock);
	
	deleteAudioBlock.addEventListener('click', function(e) {
		deleteContent(uniqID);
		modalAudioBlock.remove();
	})
}

function addFileContent(path, uniqID) 
{
	let modalFileHeader = document.getElementById('modalFileHeader');
		modalFileHeader.style.display = 'flex';

	let modalFile = document.getElementById('modalFile');
		modalFile.style.display = 'flex';

	let deleteFileBlock = document.createElement('div');
		deleteFileBlock.classList.add('modal__close');

	let deleteFile = document.createElement('img');
		deleteFile.src = '/static/img/close.svg';

	let modalFileBlock = document.createElement('div');
		modalFileBlock.id = 'content-'+uniqID;
		modalFileBlock.classList.add('modal-file__block');

	let fileImg = document.createElement('div');
		fileImg.classList.add('file-img');

	let img = document.createElement('img');
		img.src = 'static/img/file.svg';

	let fileName = document.createElement('div');
		fileName.classList.add('file-name');

	let link = document.createElement('a');
		link.href = path;

	let fileNewName = path.split('/');
		fileNewName = fileNewName[fileNewName.length-1];
	
	link.innerHTML  = fileNewName;

	deleteFileBlock.appendChild(deleteFile);
	fileName.appendChild(link)
	fileImg.appendChild(img);
	modalFileBlock.appendChild(deleteFileBlock);
	modalFileBlock.appendChild(fileImg);
	modalFileBlock.appendChild(fileName);
	modalFile.appendChild(modalFileBlock);

	deleteFileBlock.addEventListener('click', function(e) {
		deleteContent(uniqID);
		modalFileBlock.remove();
	})
}

function addVideoContent(path, uniqID) 
{
	let modalVideoHeader = document.getElementById('modalVideoHeader');
		modalVideoHeader.style.display = 'flex';

	let modalVideo = document.getElementById('modalVideo');
		modalVideo.style.display = 'flex';

	let deleteVideoBlock = document.createElement('div');
		deleteVideoBlock.classList.add('modal__close');

	let deleteVideo = document.createElement('img');
		deleteVideo.src = '/static/img/close.svg';

	let modalVideoBlock = document.createElement('div');
		modalVideoBlock.id = 'content-'+uniqID;
		modalVideoBlock.classList.add('modal-video__block');

	let video = document.createElement('video');
		video.src = path;

	let at = document.createAttribute('controls');
		video.setAttributeNode(at);

	deleteVideoBlock.appendChild(deleteVideo);
	modalVideoBlock.appendChild(deleteVideoBlock);
	modalVideoBlock.appendChild(video);
	modalVideo.appendChild(modalVideoBlock);

	deleteVideoBlock.addEventListener('click', function(e) {
		deleteContent(uniqID);
		modalVideoBlock.remove();
	})
}

function deleteContent(id) 
{
	let index = window.newContent.findIndex(function(item) { return item.uniqID === id });

	window.newContent.splice(index, 1);

	let typeImgFlag = false;
	let typeAudioFlag = false;
	let typeFileFlag = false;
	let typeVideoFlag = false;

	for (var i = 0; i < window.newContent.length; i++) 
	{
		if (window.newContent[i].type == 2) 		typeImgFlag = true;
		else if (window.newContent[i].type == 3) 	typeAudioFlag = true;
		else if (window.newContent[i].type == 4) 	typeFileFlag = true;
		else if (window.newContent[i].type == 5) 	typeVideoFlag = true;
	}

	if (!typeImgFlag) 
	{
		let modalImgHeader = document.getElementById('modalImgHeader');
			modalImgHeader.style.display = 'none';
		let modalImg = document.getElementById('modalImg');
			modalImg.style.display = 'none';
	}

	if (!typeAudioFlag) 
	{
		let modalAudioHeader = document.getElementById('modalAudioHeader');
			modalAudioHeader.style.display = 'none';
		let modalAudio = document.getElementById('modalAudio');
			modalAudio.style.display = 'none';
	}

	if (!typeFileFlag) 
	{
		let modalFileHeader = document.getElementById('modalFileHeader');
			modalFileHeader.style.display = 'none';
		let modalFile = document.getElementById('modalFile');
			modalFile.style.display = 'none';
	}

	if (!typeVideoFlag) 
	{
		let modalVideoHeader = document.getElementById('modalVideoHeader');
			modalVideoHeader.style.display = 'none';
		let modalVideo = document.getElementById('modalVideo');
			modalVideo.style.display = 'none';
	}
}

function addModal(rate_id, lvl_id, lesson) 
{
	window.addTemplate = true;
	window.rate_id = rate_id;
	window.level_id	= lvl_id;
	window.lesson = lesson;
	window.newContent = [];
	window.dz = 0;
	showModal();
}

function editModal(content, temp_id, dz) 
{
	let currentElement = document.getElementById('template_'+temp_id).children[0].children[0].children[1];
    window.editTemplate = true;
	window.template_id = temp_id;
	window.dz = dz;
	window.newContent = [];
	fillModal(content, temp_id);
	showModal(temp_id);
}

function showModal(temp_id) 
{ 
	document.getElementById('modal').style.display = 'flex';
}

function toggleModalHomework() 
{
	let homeWorkImg = document.getElementById('home_work_img');
	if (window.dz == 1) window.dz = 0;
	else 				window.dz = 1;
	homeWorkImg.classList.toggle('bg-color-red');
	homeWorkImg.classList.toggle('bg-color-green');
}

function saveModal(temp_id) 
{
	let issetText = true;

	for (var i = 0; i < window.newContent.length; i++) 
		if (window.newContent[i].type == 1) 
		{
			let modalText = document.getElementById('modalText');

			let text = modalText.value;
				text = text.replace(/</g, ' ');
  				text = text.replace(/>/g, ' ');

  		// 	console.log(text)

			if (!modalText.value.trim()) 	delete window.newContent[i];
			else 							window.newContent[i].content = text;

			issetText = false;

			break;
		} 

	window.newContent = window.newContent.filter(function(x) { return x !== undefined && x !== null });

	if (issetText) 
	{
		let modalText = document.getElementById('modalText');

		let text = modalText.value;
			text = text.replace(/</g, ' ');
			text = text.replace(/>/g, ' ');

		// console.log(text)

		if (modalText.value.trim()) 
		{
		    let uniqID = generateQuickGuid();
			let contentData = {
				uniqID: uniqID,
				type: 1,
				content: text
			}
			window.newContent.push(contentData);
		}
	}

	if (window.addTemplate && window.newContent.length > 0) sendNewTemplate();
	else if(window.editTemplate) 							sendEditedTemplate();

	closeModal(window.newContent, temp_id);

}

function sendNewTemplate() 
{
	let contents = window.newContent;
	let homework = window.dz;
	let data = JSON.stringify(contents);

	if (contents.length>0) 
	{
		POST(`/template`, `method=POST&data=${data}&rate_id=${window.rate_id}&lvl_id=${window.level_id}&lesson=${window.lesson}&dz=${window.dz}`, 
			function(req) 
			{
				let res = JSON.parse(req.response);

				if (req.status == 200) 
				{
					let newData = {
						order: res.id,
						temp_id: res.id,
						dz: homework,
						content: contents
					};

					if (document.getElementById('nope_template')) createTemplate(newData, true, false, 1);
					else 
					{
						let order = document.getElementById('template-list').children.length+1;
						createTemplate(newData, true, false, order);
						document.getElementById('template_'+res.id).scrollIntoView({ behavior: 'smooth' });
					}
				} 
				else console.log(res);
			}
		)
	}
}

function sendEditedTemplate() 
{
	let contents = window.newContent;
	let homework = window.dz;
	let temp_id = window.template_id;
	let data = JSON.stringify(contents);

	POST(`/template`, `method=PATCH&data=${data}&temp_id=${window.template_id}&dz=${window.dz}`, 
		function(req) 
		{
			let res = JSON.parse(req.response);
			if (req.status == 200) 
			{
				let order = document.getElementById('template_'+temp_id).children[0].children[0].children[1].textContent;
				let newData = {
					temp_id: temp_id,
					dz: homework,
					content: contents
				};
				createTemplate(newData, true, true, order);
			} 
			else console.log(res);
		}
	)
}

function closeModal() 
{
	document.getElementById('modal').style.display = 'none';
	clearModal();
}

function clearModal() 
{
	window.addTemplate = null;
	window.editTemplate = null;
	window.template_id = null;
	window.dz = null;
	window.newContent = [];

	let homeWorkImg = document.getElementById('home_work_img');
		homeWorkImg.classList.remove('bg-color-red');
		homeWorkImg.classList.remove('bg-color-green');

	let modalImgHeader = document.getElementById('modalImgHeader');
		modalImgHeader.style.display = 'none';
	let modalImg = document.getElementById('modalImg');
	while (modalImg.firstChild) {
	  modalImg.removeChild(modalImg.firstChild);
	}
		modalImg.style.display = 'none';
	
	let modalAudioHeader = document.getElementById('modalAudioHeader');
		modalAudioHeader.style.display = 'none';
	let modalAudio = document.getElementById('modalAudio');
	while (modalAudio.firstChild) {
	  modalAudio.removeChild(modalAudio.firstChild);
	}
		modalAudio.style.display = 'none';

	let modalFileHeader = document.getElementById('modalFileHeader');
		modalFileHeader.style.display = 'none';
	let modalFile = document.getElementById('modalFile');
	while (modalFile.firstChild) {
	  modalFile.removeChild(modalFile.firstChild);
	}
		modalFile.style.display = 'none';

	let modalVideoHeader = document.getElementById('modalVideoHeader');
		modalVideoHeader.style.display = 'none';
	let modalVideo = document.getElementById('modalVideo');
	while (modalVideo.firstChild) {
	  modalVideo.removeChild(modalVideo.firstChild);
	}
		modalVideo.style.display = 'none';

	let modalText = document.getElementById('modalText');
		modalText.value = '';
}

function fillModal(data, temp_id) 
{
	let homeWorkImg = document.getElementById('home_work_img');
	if (window.dz == 1) homeWorkImg.classList.add('bg-color-green');
	else 				homeWorkImg.classList.add('bg-color-red');
	for (var i = 0; i < data.length; i++) 
	{
		let type = data[i].type;
		let content = data[i].content;
		let uniqID = generateQuickGuid();

		let contentData = {
			uniqID: uniqID,
			type: type,
			content: content
		}

		window.newContent.push(contentData);

		switch(type)
		{
			case 1: addTextContent(content);							break;
			case 2:	addImgContent('/common/files/'+content, uniqID);	break;
			case 3:	addAudioContent('/common/files/'+content, uniqID);	break;
			case 4:	addFileContent('/common/files/'+content, uniqID);	break;
			case 5:	addVideoContent('/common/files/'+content, uniqID);	break;
		}
	}
}

function addContent() {	document.getElementById('myFile').click() };

function uploadF()
{
	document.getElementById('progres_upload').style.display = 'block';
	let file = document.getElementById('myFile').files[0];
	sendFile('/sendFile', file, (response)=>
	{
		document.getElementById('progres_upload').style.display = 'none';
		appendContent(response, getFileType(file));		
	});
	document.getElementById('myFile').value = '';
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

function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
}

function animateNavigate(height, layout, element, action) 
{
    if (action) 
    {
    	var pos = 0;
    	var inc = setInterval(incFrame, 2);
    	element.style.transform = 'rotate(90deg)'
    } 
    else 
    {	
    	var pos = height;
    	height = 0;
    	var dec = setInterval(decFrame, 2);
    	element.style.transform = 'rotate(0deg)'
    }

	function incFrame() 
	{
        if (pos >= height) 
        {
            clearInterval(inc);
        	layout.style.height = 'auto'; 
        } 
        else 
        {
            pos = pos + 0.5; 
            layout.style.height = pos + 'vh'; 
            layout.style.minHeight = pos + 'vh';
        }
    }

    function decFrame() 
    {
        if (pos <= height) 
        {
            clearInterval(dec);
        	layout.style.height = '0vh'; 

        } 
        else 
        {
            pos = pos - 0.5; 
            layout.style.height = pos + 'vh'; 
            layout.style.minHeight = pos + 'vh';
        }
    }
}

function reverceDown(id)
{
	let template_list = document.getElementById("template-list");
	let children = template_list.children;
	for(let i=0; i<children.length; i++)
	{
		if(children[i].id == 'template_'+id)
		{
			if(children[i+1])
			{
				let buf = children[i].style.order;
				children[i].style.order = children[i+1].style.order;
				children[i+1].style.order = buf;

				template_list.insertBefore(children[i+1], children[i]);
				let first = children[i].id.split('_')[1];
				let firstDivElement = document.getElementById('template_'+first).children[0].children[0].children[1].textContent;
				let firstDivElementCount = document.getElementById('template_'+first).children[0].children[0].children[1];
				let counter = JSON.parse(firstDivElement) - 1;
				firstDivElementCount.innerHTML = counter;

				let second = children[i+1].id.split('_')[1];
				let secondDivElement = document.getElementById('template_'+second).children[0].children[0].children[1].textContent;
				let secondDivElementCount = document.getElementById('template_'+second).children[0].children[0].children[1];
				let secondCounter = JSON.parse(secondDivElement) + 1;
				secondDivElementCount.innerHTML = secondCounter;

				POST('/template', `method=REVERSE&&first=${first}&&second=${second}`, ()=>{});

				break;
			}
		}
	}
}

function reverceUp(id)
{
	let template_list = document.getElementById("template-list");
	let children = template_list.children;
	for(let i=0; i<children.length; i++)
	{
		if(children[i].id == 'template_'+id)
		{
			if(children[i-1])
			{					
				let buf = children[i].style.order;
				children[i].style.order = children[i-1].style.order;
				children[i-1].style.order = buf;

				template_list.insertBefore(children[i], children[i-1]);

				let first = children[i].id.split('_')[1];
				let firstDivElement = document.getElementById('template_'+first).children[0].children[0].children[1].textContent;
				let firstDivElementCount = document.getElementById('template_'+first).children[0].children[0].children[1];
				let counter = JSON.parse(firstDivElement) + 1;
				firstDivElementCount.innerHTML = counter;

				let second = children[i-1].id.split('_')[1];
				let secondDivElement = document.getElementById('template_'+second).children[0].children[0].children[1].textContent;
				let secondDivElementCount = document.getElementById('template_'+second).children[0].children[0].children[1];
				let secondCounter = JSON.parse(secondDivElement) - 1;
				secondDivElementCount.innerHTML = secondCounter;

				POST('/template', `method=REVERSE&&first=${first}&&second=${second}`, ()=>{});

				break;
			}
		}
	}
}
