function getInfoPage(){
	content.innerHTML=
	`
		<div id = 'container' class = 'profile_cont'>
			<h3>Информация о студенте</h3>
			<div class="profile_err" id="info_err"></div>
			<input class="profile_input" id="info_firstname" placeholder="Имя" type="text">
			<input class="profile_input" id="info_lastname" placeholder="Фамилия" type="test">
			<input class="profile_input" id="info_age" placeholder="Возраст" type="number">
			<input class="profile_input" id="info_eMail" placeholder="e-mail" type="email">
			<button class="showPassword" onclick="saveInfo()">Сохранить</button>
		</div>
	`
}

function saveInfo(){
	let firstname = document.getElementById('info_firstname');
	let lastname = document.getElementById('info_lastname');
	let age = document.getElementById('info_age');
	let mail = document.getElementById('info_eMail');
	let err = document.getElementById('info_err');
	if(validateInfo({firstname, lastname, age, mail, err})){
		POST('/account', `method=DATA&&firstname=${lastname.value}&&lastname=${lastname.value}
						  &&age=${age.value}&&email=${mail.value}`,(res, status)=>{
			console.log(res);
			console.log(status);
		})
	}
}

function validateInfo(data){
	if(!data.firstname.value){
		throwError(data.err,'Введите ваше имя!',data.firstname);
		return false;
	}
	hideError(data.err,data.firstname);
	if(!data.lastname.value){
		throwError(data.err,'Введите вашу фамилию!',data.lastname);
		return false;
	}
	hideError(data.err,data.lastname);
	if(!data.age.value){
		throwError(data.err,'Введите ваш возраст!',data.age);
		return false;
	}
	if(data.age.value > 80){
		throwError(data.err,'Вы уверенны в своем возрасте?',data.age);
		return false;
	}
	hideError(data.err,data.age);
	if(!data.mail.value){
		throwError(data.err,'Введите ваш e-mail!',data.mail);
		return false;
	}

	let stat = false;
	for (var i = 0; i < data.mail.value.length; i++) {
		if(data.mail.value[i] == '@'){
			for (var j = i+1; j < data.mail.value.length; j++) {
				if(data.mail.value[j] == '.'){
					stat = true;
				}else if(data.mail.value[j].charCodeAt() < 65 || data.mail.value[j].charCodeAt() > 122){
					throwError(data.err,'Некоректный e-mail!',data.mail);
					return false;
				}
			}
		}
	}
	if (stat) {
		hideError(data.err,data.mail);
		return true;
	}
}