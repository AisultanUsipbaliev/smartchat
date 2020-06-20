// Функция для удаления пробелов
    function noplace(str)
    {
        let VRegExp = new RegExp(/^[ ]+/g);
        let VResult = str.replace(VRegExp, '');
        return VResult;
    };
// Проверка информации о пользователе
	function validation1()
	{		
		let login = document.getElementById('login').value;
		let lastname = document.getElementById('lastname').value;
		var phone = document.getElementById('phone').value;

		document.getElementById('login').style.background = 'white';
		document.getElementById('lastname').style.background = 'white';
		document.getElementById('phone').style.background = 'white';

		if( noplace(login) == '')
		{
			notifier('Введите имя!', 'red');
			document.getElementById('login').style.background = 'linen';
			return false;
		}

		if( noplace(lastname) == '')
		{
			notifier('Введите фамилию!', 'red');
			document.getElementById('lastname').style.background = 'linen';
			return false;
		}

		if(phone.length<11)
		{
			notifier('Телефон должен содержить 11 цифр!!!','red');
			document.getElementById('phone').style.background = 'linen';
			return false;
		}
		return true;
	}
// Проверка паролей	
	function validation2(){
			var pass = document.getElementById('pass').value;
			var repass = document.getElementById('Repass').value;
			let oldpass = document.getElementById('oldpass');

			document.getElementById('pass').style.background = 'white';
			document.getElementById('Repass').style.background = 'white';
			oldpass.style.background = 'white';

			if(oldpass.value.length == 0)
			{
				notifier('Введите старый пароль!','red');
				oldpass.style.background = 'linen';
				return false;
			}

			if(pass != repass){
				notifier('Пароли не совпадают','red');
				document.getElementById('Repass').style.background = 'linen';
				return false;
			}
			if(pass.length<6){
				notifier('Пароль должен содержать минимум 6 цифр','red');
				document.getElementById('pass').style.background = 'linen';
				return false;
			}
			return true;			
		}
// Получение данных о пользователе
	function getInfo(req)
	{
		if(req.status == 200)
		{
			let res = JSON.parse(req.response);
			let body = res.body;

			document.getElementById('ava').src 			= body.ava? 'common/photo/' + body.ava: '/static/img/avatar.jpg';
			document.getElementById('login').value 		= body.login;
			document.getElementById('lastname').value	= body.lastname;
			document.getElementById('phone').value 		= body.phone;
		}
	}
// Скрипт
	POST('/teacher', 'method=INFO', getInfo);

// Изменяем свои данные
	document.getElementById('edit_info').addEventListener('click', function(ev)
	{
		if(validation1())
		{
			let login 	= document.getElementById('login').value;
			let lastname	= document.getElementById('lastname').value;
			let phone 		= document.getElementById('phone').value;
			POST('/teacher', 'method=PATCH&&login='+ login+'&&lastname='+ lastname+'&&phone='+ phone, (req)=>
				{
					if(req.status == 200)
					{
						notifier('Данные успешно обновлены!', 'green');
						setTimeout(()=>
							{
							top.location='/profile';
							},1250);

					}
					else
					{
						notifier('Проблемы с записью данных, попробуйте в другой раз!', 'red');
					}
				});
		}
	});

// Ответ на изменение пароля
	function redPass(req)
	{
		if(req.status == 200)
		{
			let ans = JSON.parse(req.response);
			let mes = ans.message;

			if(mes == 'ok')
			{
				notifier('Пароль успешно изменен!', 'green');
			}
			else
			{
				notifier(mes, 'red');
				document.getElementById('oldpass').style.background = 'linen';
			}
		}
	}
// Изменяем пароль
	document.getElementById('edit_pass').addEventListener('click', function(ev)
		{
			if(validation2())
			{
				let oldpass = document.getElementById('oldpass').value;
				let pass 	= document.getElementById('pass').value;
				let Repass 	= document.getElementById('Repass').value;
				POST('/teacher','method=PATCH-PASS&&oldpass='+oldpass+'&&pass='+ pass, redPass);
			}
			
		});

// Ответ на изменение фотки
	function redPhoto(res)
	{
		top.location.href = '/redact';
	}
// Меняем фотку
	document.getElementById('ava').addEventListener('click', function()
		{
			document.getElementById('newPhoto').click();
		});
	document.getElementById('newPhoto').addEventListener('change', function()
		{
			document.getElementById('ava').src = "/static/img/2.svg"
			let file = document.getElementById('newPhoto').files[0];
			sendFile('/uploadPicture', file, redPhoto);
		});