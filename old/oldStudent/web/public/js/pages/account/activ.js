function changeEmail(){
	document.getElementById('eMail').style.display = "block";
	document.getElementById('eMail').placeholder = "e-mail";
	document.getElementById('repeat').style.display = "none";
	document.getElementById('change').style.display = "none";
	document.getElementById('confirm').style.display = "block";
}

function sendOnEMail(){
	POST('/data', 'method=REPEAT',(res, status)=>{
		let err = document.getElementById('_err');
		if(status === 200){
				err.style.color = 'lightgreen'
				throwError(err,`На вашу почту отправленно повторное письмо с активацией аккаунта!`);
				document.getElementById('change').style.display = "none";
				document.getElementById('confirm').style.display = "none";
				document.getElementById('repeat').style.display = "none";
		}
	})
}

function confirmEMail(){
	let mail = document.getElementById('eMail');
	let err = document.getElementById('_err');
	let stat = false;
	for (var i = 0; i < mail.value.length; i++) {
		if(mail.value[i] == '@'){
			for (var j = i+1; j < mail.value.length; j++) {
				if(mail.value[j] == '.'){
					stat = true;
				}else if(mail.value[j].charCodeAt() < 65 || mail.value[j].charCodeAt() > 122){
					err.style.color = 'red'
					throwError(err,'Некоректный e-mail!',mail);
					return false;
				}
			}
		}
	}
	if (stat) {
		hideError(err,mail);
		POST('/data', `method=NEW_EMAIL&&email=${mail.value}`,(res, status)=>{
			if(status === 200){
				mail.style.display = "none"
				err.style.color = 'lightgreen'
				throwError(err,`На вашу почту ${mail.value} отправленно письмо с подтверждением!`,mail);
				document.getElementById('confirm').style.display = "none";
				document.getElementById('repeat').style.display = "none";
			}else if(status === 401){
				err.style.color = 'red'
				throwError(err,'Данной почты не существует! Попробуйте другую',mail);		
			}
		})
	}else{
		err.style.color = 'red'
		throwError(err,'Некоректный e-mail!',mail);
	}
}


function throwError(err, msg, inp)
{
	err.innerHTML = msg;
	err.style.display = 'block';
	if(inp) inp.style.background = 'linen';
}

function hideError(err, inp)
{
	err.style.display = 'none';
	if(inp) inp.style.background = 'white';
}