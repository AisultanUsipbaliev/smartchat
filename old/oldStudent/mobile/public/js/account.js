function login(e)
{
	e.preventDefault();
	let tel 	= document.getElementById('phoneInput').value;
	let pass 	= document.getElementById('passInput').value; 
	let err 	= document.getElementById('signin-err');
	tel = tel.replace(/\s/g, '');
	if(validateIn())
	{
		POST('/account', `method=LOGIN&&phone=${tel.trim()}&&password=${pass}`, (res, stat) => 
			{ 
				console.log(res)
				switch(stat)
				{
					case 200:
						setCookie('SAU', res.phone, 	1, { maxAge: 900000, httpOnly: true });
						setCookie('SAP', res.password, 	2, { maxAge: 900000, httpOnly: true });
						setCookie('SAI', res.id, 		3, { maxAge: 900000, httpOnly: true });
						top.location.href = '/profile'; 
					break;
					case 401:
						showErr(err, '<a href = "/activate">Активируйте ваш аккаунт!</a>');
					break;
					case 402:
						showErr(err, 'Неверный пароль!');
					break;
					case 403:
						 showErr(err, 'Данного пользователя не существует!');
					break;
					case 406:
						 showErr(err, 'Аккаунт заблокирован!');
					break;
					default: 
						console.log(res);
					break;
				}
			});
	}
}

function registrate(e)
{
	e.preventDefault();
	if(validateUp())
	{
		let tel 	= document.getElementById('phoneInput').value;
		let pass  	= document.getElementById('pass').value; 
		let repass 	= document.getElementById('repass').value;
		let name 	= document.getElementById('name').value;
		let err 	= document.getElementById('signup-err');
		tel = tel.replace(/\s/g, '');
		POST('/account', 
			`method=REGISTRATION&&firstname=${name}&&password=${pass.trim()}&&phone=${tel}&&timeDiff=${getTimeDifference(24)-24}`, 
			(res, stat)=>
			{
				if(stat == 200)
				{
					POST('/account', `method=SMS&&phone=${tel.trim()}`, (res, stat)=>
						{
							if(stat == 200) top.location.href = '/activate?tel=' + tel;
							else console.log('Error: ', res);
						});
				}
				else if(stat == 400)
				{
					showErr(err, 'Данный пользователь существует!');
				}
				else if(stat == 400)
				{
					showErr(err, 'Неверный e-mail');
					document.getElementById('eMail').style.background = 'linen';	
				}
				else
				{
					console.log(res);
				}
			});
	}
}

function validateUp()
{
	let tel 	= document.getElementById('phoneInput');
	let pass  	= document.getElementById('pass');
	let repass 	= document.getElementById('repass');
	let name 	= document.getElementById('name');
	let err 	= document.getElementById('signup-err');
	let value = tel.value.replace(/\s/g, '');
	if(value.length > 10){
		tel.style.background = 'linen';
		showErr(err, 'Некорректные данные');
		return false;
	}
	
	let mas = value.split(''); 
	for(let i = 0; i<mas.length; i++)
	{
		if(!Number.isInteger(Number(mas[i])))
		{
			tel.style.background = 'linen';
			showErr(err, 'Некорректные данные');
			return false;
		}
	}
	
	if (!checkInput(tel, 10 ,'Некорректные данные', err, 1)) 	return false;
	if (!checkInput(name, 1, 'Введите ваше имя', err)) 			return false;
	if (!checkInput(pass, 5 ,'Слишком короткий пароль', err))	return false;

	if(pass.value != repass.value)
	{
		checkInput(repass, 1000, 'Пароли не совпадают', err);
		return false;
	}
	return true;
}

function validateIn()
{
	let tel 	= document.getElementById('phoneInput');
	let pass 	= document.getElementById('passInput');
	let err 	= document.getElementById('signin-err');
	let value = tel.value.replace(/\s/g, '');
	if(value.length > 10){
		tel.style.background = 'linen';
		showErr(err, 'Некорректные данные');
		return false;
	}
	
	let mas = value.split(''); 
	for(let i = 0; i<mas.length; i++)
	{
		if(!Number.isInteger(Number(mas[i])))
		{
			tel.style.background = 'linen';
			showErr(err, 'Некорректные данные');
			return false;
		}
	}
	
	if(!checkInput(tel, 10, 'Некорректные данные', err, 1)) 	return false;
	tel.style.background = 'white';
	if(!checkInput(pass, 1, 'Введите пароль', err)) 		return false;

	return true;
}


function showErr(err, msg)
{
	err.style.display = 'block';
	err.innerHTML = msg;
}


function hideErr(err)
{
	err.style.display = 'none';
}

function keyUpTel(e)
{
	if(e.key < 10 && e.key != ' ')
	{
		let val 	= document.getElementById('phoneInput');

		val.value = val.value.substring(0, 9);
	}
}

function checkInput(inp, leng ,msg, err, parent)
{
	if(inp.value.length < leng)
	{
		showErr(err, msg);
		inp.style.background = 'linen';
		return false;
	}
	else
	{
		hideErr(err);
		inp.style.background = 'white';
		return true;
	}
}

function checkEmail(mail){
	let stat = false;
	for (let i = 0; i < mail.length; i++) {
		if(mail[i] == '@'){
			for (let j = i+1; j < mail.length; j++) {
				if(j == mail.length) return false;
				if(mail[j] == '.'){
					for (let q = j+1; q < mail.length; q++) {
						if(mail[q].charCodeAt() < 65 || mail[q].charCodeAt() > 122 || mail[q] == '.') return false;	
						else stat = true;
					}
				}else{
					if(mail[j].charCodeAt() < 65 || mail[j].charCodeAt() > 122) return false;	
				}
			}
		}
	}
	if(!stat) return false;
	else	  return true;
}