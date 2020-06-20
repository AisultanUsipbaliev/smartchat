// Глобальные переменные
	let menu = false;
	let cont = document.getElementById('container');
	let test_id = 0;
// Скрипт
	getTestsLayout();

// Функция открывает страницу "тесты"
	function getTestsLayout()
	{
		cont.innerHTML =
			`
			<img src='static/img/blue_plus.png' title='Добавить' class = 'blue_plus'>
			<div class = 'top' id="top">
				<div class = 'topName'>
					<h4 class = 'margin-left'>Название теста</h4>
				</div>
				<div class = 'topLvl'>
					<h4>Уровень</h4>
				</div>
				<div class = 'topDate'>
					<h4>Дата</h4>
				</div>
			</div>
			<div id = 'tests' class = 'tests'></div>
			`;
			generateScroll('top',cont,{height:'12%', width:'100%'},1,2);
			POST('/test', 'method=GET', (req)=>
			{
				let res = JSON.parse(req.response);
				if(req.status == 200)
				{
					let test = res.body;
					for(let i=0; i<test.length; i++)
					{
						if(i == test.length - 1 && test.length > 8)
							addTest(test[i].test_id, test[i].test_name, test[i].lvl_name, test[i].dt, true);
						else addTest(test[i].test_id, test[i].test_name, test[i].lvl_name, test[i].dt);
					}
					generateScroll('tests',cont,{height:'88%', width:'100%'},1,2)
				}
			});

		document.querySelector('.blue_plus').addEventListener('click', (e)=> 
			{
				top.location.href = "/creater"
				test_id = 0;
			});
	}

// Функция открывает меню
	function showMenu(id, last)
	{
		document.getElementById('menu=' + id).style.display = 'block';
		if(last) document.getElementById('menu=' + id).style.marginTop = '-7.5vh';
	}

// Функция скрывает меню
	function hideMenu()
	{
		let m = document.getElementsByClassName('test_menu');
		for(let i = 0; i<m.length; i++)
		{
			m[i].style.display = 'none';
		}
	}

// Функция добавляет тест
	function addTest(id, name, level, date, last)
	{
		let tests = document.getElementById('tests');

		let test = document.createElement('div');
		test.classList.add('test');
		test.id = 'test=' + id;

		let testName = document.createElement('div');
		testName.classList.add('testName');
		testName.classList.add('line');

		let points = document.createElement('img');
		points.id = 'points=' + id;
		points.classList.add('points');
		points.src = 'static/img/points.png';
		points.addEventListener('mouseover', (e)=>
			{
				if(last) {showMenu(id, true);}
				else showMenu(id);
			});

		testName.appendChild(points);

		let test_name = document.createElement('h4');
		test_name.innerHTML = name;
		testName.appendChild(test_name);

		let menu = document.createElement('div');
		menu.id = 'menu=' + id;
		menu.classList.add('test_menu');

		menu.addEventListener('mouseleave', (e)=>
			{
				hideMenu();
			});

		let redact = document.createElement('div');
		redact.id = 'redact=' + id;
		redact.classList.add('but');

		let red_im = document.createElement('img');
		red_im.classList.add('menu_img');
		red_im.src = 'static/img/pencil1.svg';
		redact.appendChild(red_im);

		let red_title = document.createElement('a');
		red_title.classList.add('menu_title');
		red_title.innerHTML = 'Редактировать';
		redact.appendChild(red_title);

		redact.addEventListener('click', (ev)=>
			{
				top.location.href = "/creater?id="+id;
			});

		let del = document.createElement('div');
		del.id = 'del=' + id;
		del.classList.add('but');

		let del_im = document.createElement('img');
		del_im.classList.add('menu_img');
		del_im.src = 'static/img/rem.png';
		del.appendChild(del_im);

		let del_title = document.createElement('a');
		del_title.classList.add('menu_title');
		del_title.innerHTML = 'Удалить';
		del.appendChild(del_title);

		del.addEventListener('click', ()=>
			{
				if(confirm('Вы хотите удалить тест?'))
				{
					POST('/test', 'method=DELETE&&test_id=' + id, (req)=>
						{
							if(req.status == 200)
							{
								deleteTest(id);
							}
						});
				}
			});

		menu.appendChild(redact);
		menu.appendChild(del);
		testName.appendChild(menu);

		let testLvl = document.createElement('div');
		testLvl.classList.add('testLvl');
		testLvl.classList.add('line');
		testLvl.innerHTML = "<h4>"+level+"</h4>";

		let testDate = document.createElement('div');
		testDate.classList.add('testDate');
		testDate.classList.add('line');
		testDate.innerHTML = "<h4>"+getDateName(date)+"</h4>";

		test.appendChild(testName);
		test.appendChild(testLvl);
		test.appendChild(testDate);

		tests.appendChild(test);
	}

// Функция удаляет тест
	function deleteTest(id)
	{
		let tests = document.getElementById('tests');
		tests.removeChild(document.getElementById('test='+id));
	}
// Функция возвращает время 
	function getDateName(d)
	{
		let now = new Date();
		let date = new Date(d);

		let m = date.getMonth() + 1;
		let string = date.getDate() + "." + m + "." + date.getFullYear();

		if(now.getFullYear() == date.getFullYear() && now.getMonth() == date.getMonth())
		{
			if(now.getDate() == date.getDate())
			{
				if(date.getHours() == now.getHours())
				{
					if(date.getMinutes() == now.getMinutes())
					{
						return 'только что';
					}
					else
					{
						let difference = now.getMinutes() - date.getMinutes();
						if(difference < 2) return 'минуту назад';
						else if(difference > 1 && difference < 5) return  difference + ' минуты назад';
						else if(difference > 4 && difference <21) return difference + ' минут назад';
						else if(difference >20)
						{
							if(difference%10 < 5 && difference%10 != 0)
							{
								if(difference%10 == 1) return  difference + ' минуту назад';
								else return difference + ' минуты назад';
							}
							else
							{
								return difference + ' минут назад';
							}
						}
					}
				}
				else
				{
					let difference = now.getHours() - date.getHours();
					if(difference == 1)
					{
						return 'час назад';
					}
					else if(difference > 1 && difference < 5)
					{
						return difference + ' часа назад';
					}
					else if(difference >= 5 && difference < 21)
					{
						return difference + ' часов назад';
					}
					else if(difference==21)
					{
						return difference + ' час назад';
					}
					else if(difference > 21)
					{
						return difference + ' часа назад';
					}
				}
			}
			else
			{
				let difference = now.getDate() - date.getDate();

				if(difference <= 3) 
				{
					if(difference == 1)
					{
						return 'вчера';
					}
					else
					{
						return difference + ' дня назад';
					}
				}
				else
				{
					return string;
				}

			}
		}
		else
		{
			return string;
		}
	}

