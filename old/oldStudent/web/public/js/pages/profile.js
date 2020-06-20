function getProfilePage()
{
	content.innerHTML = 
	`
		<div id = 'container' class = 'profile_cont'>
			<div class = 'profile_ava'>
				<img title = 'Изменить' id = 'avatar' src = '/pictures/avatar.jpg'>
			</div>	
			<input id = 'file' accept="image/*" type = 'file' style = 'display:none'>
			<div id = 'name' class = 'profile_name'></div>
			<div id = 'age' class = 'profile_age'></div>
			<div id = 'lvl' class = 'profile_tel'></div>
			<div id = 'tel' class = 'profile_tel'></div>

			<button id = 'redact' class = 'profile_redact' title='Редактировать'><img src='/pictures/pencil.png'></button>
		</div> 
		<div class='blockWithPass' id='blockWithPass'>
		</div>
	`;

	let file = content.querySelector('#file');
	let but = content.querySelector('#redact');
	let ava = content.querySelector('#avatar');
	let div = content.querySelector('#container');

	file.addEventListener('change', function()
		{
			var xhr = new XMLHttpRequest(),
		    fd = new FormData();
			let f = file.files[0];
			fd.append( 'uploadFile', f);
			xhr.open( 'POST', '/uploadPicture', true );
			ava.src = "/img/2.svg"
			xhr.onreadystatechange = function()
			  {
			    if(xhr.readyState == 4) {
			      document.body.style.cursor = "auto"
			      let res = JSON.parse(xhr.response);
			      ava.src = 'common/photo/' + res;
			    }
			  };
			xhr.send( fd );
		});
	ava.addEventListener('click', function()
		{
			if(but.innerHTML == 'Сохранить')
			file.click();
			else{
				showPopup(`<div style="width: 100%; height: 80vh;"><img src="${ava.src}" style="max-width: 100%; max-height: 100%;"></img></div>`, 
				{border: 'none', background: 'transparent', maxHeight: '75%', maxWidth: '75%', curtain: true, top: '6vh', textAlign: 'center'});
			
			}
		});

	but.addEventListener('click', function()
		{
			if(but.innerHTML != 'Сохранить')
			{	  
				let name = div.querySelector('#name');
				let age = div.querySelector('#age');
				let tel = div.querySelector('#tel');
				but.classList.add('saveBut');
				document.getElementById('lvl').innerHTML = '';
				but.title = 'Сохранить';
				showRedactLayout({ name, tel ,age, div, but });
			}
			else
			{
				let err 		= div.querySelector('#err1');
				let firstname 	= div.querySelector('#firstname');
				let lastname 	= div.querySelector('#lastname');
				let age 		= div.querySelector('#age');
				let tel 		= div.querySelector('#tel');

				if(!firstname.value.length) { throwError(err, 'Введите имя!', firstname); return;}
				else { hideError(err, firstname); }
				if(!lastname.value.length) { throwError(err, 'Введите фамилию!', lastname); return;}
				else { hideError(err, lastname); }
				if(!age.value.length) { throwError(err, 'Введите дату рождения!', age); return;}
				else { hideError(err, age); }
				if(age.value > 100 || age.value < 1) { throwError(err, 'Некорректные данные!', age); return;}
				else { hideError(err, age); }

				POST('/student', 
					`method=PATCH&&id=${getCookie('SAI')}&&firstname=${firstname.value.trim()}&&lastname=${lastname.value.trim()}&&birthday=${age.value.trim()}`,
					function(res,stat)
					{
						if(stat == 200)
						{
							but.title = 'Редактировать';
							but.classList.remove('saveBut');
							getProfilePage();
						}
					});
			}
		});

	getMyProfile()
}

function getMyProfile()
{
	POST('/student', `method=PROFILE&&id=${getCookie('SAI')}`, function(res,stat)
		{
			let data = res.body;
			if(stat == 200) {
				if(data.ava) document.getElementById('avatar').src = avaFromSocial(data.ava)? data.ava:'common/photo/' + data.ava;
				if(data.lastname != '*')
				 document.getElementById('name').innerHTML = data.firstname + ' ' + data.lastname;
				else document.getElementById('name').innerHTML = data.firstname;
				 document.getElementById('age').innerHTML = data.birthday? getAgeNameProfile(data.birthday): '';
				 document.getElementById('age').placeholder = data.birthday;
				 document.getElementById('tel').innerHTML = data.phone;
				 if(data.lvl_name != 'No level'){
					document.getElementById('lvl').innerHTML = 'Уровень ' + data.lvl_name;
				 }else{
				 	document.getElementById('lvl').innerHTML = 'У вас еще нет уровня';
				 }

				 if(!data.firstname) document.getElementById('redact').click()
			}
			else console.log(res);
		});
}

function showRedactLayout(data) {
	console.log(data)
	let div = data.div;
	div.removeChild(data.name);
	div.removeChild(data.age);
	div.removeChild(data.tel);

	let err = document.createElement('h3');
	err.id = 'err1';
	err.classList.add('profile_err');
	div.insertBefore( err, data.but);

	let firstnameInput = document.createElement('input');
	firstnameInput.id = 'firstname';
	firstnameInput.placeholder = 'Ваше имя'
	firstnameInput.classList.add('profile_input');
	firstnameInput.value = data.name.innerHTML.split(' ')[0] != 'null'?data.name.innerHTML.split(' ')[0]:'';
	div.insertBefore( firstnameInput, data.but);

	let lastnameInput = document.createElement('input');
	lastnameInput.id = 'lastname';
	lastnameInput.placeholder = 'Ваша фамилия'
	lastnameInput.classList.add('profile_input');
	if(data.name.innerHTML.split(' ')[1] != '*')
	lastnameInput.value = data.name.innerHTML.split(' ')[1]!= 'null'?data.name.innerHTML.split(' ')[1]:'';
	else lastnameInput.placeholder = "Фамилия";
	div.insertBefore( lastnameInput, data.but);

	let ageInput = document.createElement('input');
	ageInput.type = 'date';
	ageInput.id = 'age';
	ageInput.placeholder = 'Дата рождения'
	ageInput.classList.add('profile_input');
	ageInput.title  = 'дата рождения';
	let date = new Date(data.age.placeholder);
	date = new Date(date.setDate(date.getDate() + 1));
	if(data.age.placeholder != '1970-01-01T18:00:00.000Z' && data.age.placeholder)
	ageInput.value = date.toISOString().slice(0,10);
	div.insertBefore(ageInput, data.but);

	let showPasswordRedact = document.createElement('button');
	showPasswordRedact.classList.add('showPassword');
	showPasswordRedact.innerHTML = 'Пароль';
	showPasswordRedact.addEventListener('click', function(){
		showBlockPass();
	});
	div.appendChild(showPasswordRedact);

	data.but.innerHTML = 'Сохранить';
}
function showBlockPass(){
	let block = document.getElementById('blockWithPass');
	block.style.marginLeft = '2.5vw';
	block.innerHTML = '';

	let err_block = document.createElement('h2');
	err_block.id = 'err_block';
	err_block.classList.add('profile_err');
	block.appendChild(err_block);

	let oldPass = document.createElement('input');
	oldPass.type = 'password';
	oldPass.classList.add('profile_input');
	oldPass.placeholder='Старый пароль';
	block.appendChild(oldPass);

	let newPass = document.createElement('input');
	newPass.type = 'password';
	newPass.classList.add('profile_input');
	newPass.placeholder='Новый пароль';
	block.appendChild(newPass);

	let newPassRepeat = document.createElement('input');
	newPassRepeat.type = 'password';
	newPassRepeat.classList.add('profile_input');
	newPassRepeat.placeholder='Повторите Новый пароль';
	block.appendChild(newPassRepeat);

	let savePass = document.createElement('button');
	savePass.classList.add('showPassword');
	savePass.innerHTML = 'Изменить пароль';

	let _err = document.getElementById('err_block');

	savePass.addEventListener('click', function(){
		if (!oldPass.value) {
			throwError(_err, 'Введите старый пароль', oldPass); 
			return;
		}else if (!newPass.value) {
			hideError(_err, oldPass);
			throwError(_err, 'Введите новый пароль', newPass); 
			return;
		}else if (!newPassRepeat.value) {
			hideError(_err, newPass);
			throwError(_err, 'Повторите старый пароль', newPassRepeat); 
			return;
		}else{
			hideError(_err, newPassRepeat);
			testNewPass(oldPass, newPass, newPassRepeat);
		}

	});
	block.appendChild(savePass);
}

function testNewPass(oldpass, newpass, repeatpass){
	let _err = document.getElementById('err_block');
	if (newpass.value !== repeatpass.value) {
		throwError(_err, '', repeatpass);
		throwError(_err, 'Пароли не совпадают', newpass); 
			return;
	}else{
		POST('/student', `method=PASSWORD&&old=${oldpass.value}&&password=${newpass.value}`, function(res,stat){
			if(res.status === 403){
				throwError(_err, 'Неверный пароль!', oldpass);

			}else if (res.status === 200){
				_err.style.display = 'block';
				_err.innerHTML = 'Пароль успешно изменён!';
				_err.style.color = 'rgba(0,180,0,0.5)';
				setTimeout(function(){
					document.getElementById('blockWithPass').style.marginLeft = '-34vw';
					_err.style.display = 'none';
					_err.style.color = 'red';
				},2500);
			}
		});
	}
}

function throwError(err, msg, inp)
{
	err.innerHTML = msg;
	err.style.display = 'block';
	inp.style.background = 'linen';
}

function hideError(err, inp)
{
	err.style.display = 'none';
	inp.style.background = 'white';
}

function getAgeNameProfile(a)
{
	a = getAgeCount(a);
	if(a <= 0) return '';
	else if(a < 21)
	{
		if(a == 1) 			return a + ' год';
		else if(a < 5) 		return a + ' года';
		else 			 	return a + ' лет';
	}
	else
	{
		if 		(a%10 == 1) 			return a + ' год';
		else if (a%10 > 0 && a%10 < 5)  return a + ' года';
		else 							return a + ' лет';
	}
}

function getAgeCount(a){
	let day = new Date(a);
	let today = new Date();
	let year = -1;
	if(day.getMonth() < today.getMonth()){
		if(day.getMonth() == today.getMonth()){
			if(day.getDate() >= today.getDate())
				year = 0;
		}else year = 0;

	}
	return today.getFullYear() - day.getFullYear() + year;
}

function avaFromSocial(ava) {
	let mas = ava.split('/')
	if(mas.length > 1) 	return true
	else 				return false
}