/*Валидация*/
function Validate()
{
	var r = /^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i;

	let email 		= document.getElementById('email').value;
	let pass 		= document.getElementById('pass').value;
	let login 		= document.getElementById('login').value;
	let lastname 	= document.getElementById('lastname').value;
	let phone 		= document.getElementById('phone').value;
	var Cpass = document.getElementById('Cpass').value;


	if(document.getElementById('email').classList.contains('color_red'))
	{
		document.getElementById('err').innerHTML = 'Пользователь с таким Email уже существует!';
		return false;
	}

	if(!r.test(email))
	{
		document.getElementById('err').innerHTML = "Введите корректный e-mail адрес";
		return false;
	}

	if(login.length == 0)
	{
		document.getElementById('err').innerHTML = 'Введите ваше имя!';
		return false;
	}

	if(lastname.length == 0)
	{
		document.getElementById('err').innerHTML = 'Введите вашу фамилию!';
		return false;
	}

	if(phone.length < 10)
	{
		document.getElementById('err').innerHTML = "Телефон должен содержать 11 цифр";
		return false;
	}

	if(pass != Cpass)
	{
		document.getElementById('err').innerHTML = "Пароли не совпадают";
		return false;
	}

	if(pass.length < 6)
	{
		document.getElementById('err').innerHTML = "Пароль должен содержать не менее 6 символов";
		return false;
	}

	return true;
}

/*Проверка ЛОГИНА на уникальность*/
document.getElementById('email').addEventListener('keyup', function(ev)
	{
		if(this.value != '')
		{
			var r = /^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i;
			let req = new XMLHttpRequest();
			let target = this;
			target.classList.remove('color_red');
			target.classList.remove('color_green');
			req.onreadystatechange = function()
			{
				if(req.readyState == 4)
				{
					if(req.status == 200)
					{
						if(r.test(target.value)) target.classList.add('color_green');	
						else target.classList.add('color_red');
					}
					else
					{
						target.classList.add('color_red');
					}
				}
			}
			req.open('POST','/account');
			req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			req.send('method=CHECK&&email='+ target.value);
		}
	});

/*Отправка инфо на регистрацию*/
document.getElementById('login_btn').addEventListener('click', function(event)
	{
		document.getElementById('err').innerHTML = "";
		event.preventDefault();

		let login 		= document.getElementById('login').value;
		let email 		= document.getElementById('email').value;
		let pass 		= document.getElementById('pass').value;
		let lastname 	= document.getElementById('lastname').value;
		let phone 		= document.getElementById('phone').value;

		let params = 
			'method=' 		+ 'REG'+
			'&&login=' 		+ login+
			'&&email=' 		+ email+
			'&&pass=' 		+ pass+
			'&&lastname='	+ lastname+
			'&&phone=+7'	+ phone;
		 
		if(Validate())
		{
			let req = new XMLHttpRequest();
			req.onreadystatechange = function()
			{
				if(req.readyState == 4)
				{
					let res = JSON.parse(req.response);
					if(req.status == 200)
					{
						top.location.href = '/activate';
					}
					else
					{
						document.getElementById('err').innerHTML = res.message;
					}
				}
			}
			req.open('POST','/account');
			req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			req.send(params);
		}
	});
