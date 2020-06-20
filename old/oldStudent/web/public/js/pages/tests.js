function getTestsPage()
{
	content.innerHTML = 
	`
	<div class = "test_block">
		<div class = 'test_test testTop' id="testTop">
			<p class = 'testName table'>Тест</p>
			<p class = 'testStat table'>Статус</p>
			<p class = 'testDate table'>Дата</p>
			<p class = 'testLevel table'>Уровень</p>
			<p class = 'actions table'>Результат</p>
		</div>
		<div class = 'test_tests hidescroll' id="result-list">
			<div class="PreTests">Выберите курс</div>
		</div>
	</div>
	`;

addCourseLine();
}

function addCourseLine()
{
	let tests = content.querySelector('.test_tests');
		tests.innerHTML = ``;
	
	POST('/test', `method=GET`, (res)=> 
		{
			if(res.status == 200){
				if(res.data.length > 0) {

					res.data.sort(function(a,b){
						if(a.dt<b.dt)return 1;
						if (a.dt>b.dt) return -1;
						return 0;
					});
					for(let i = 0; i<res.data.length; i++){
						addTestLine(res.data[i], tests);
						let action = document.getElementsByClassName('ended')[i];
						if (res.data[i].answers) {
							action.classList.add('home-work__button');
							action.addEventListener('click', (e)=>{
								action.title = 'Просмотреть результаты';
								action.classList.add('viewResult')
								goto('testresult/' + res.data[i].test_id)
							})
						}
					}
				}
			}else{
				tests.innerHTML = '<div class="nopeTask">У вас нет тестов</div>'
			}
			generateScroll('testTop', content.querySelector('.test_block'), {height: '8.3vh', width: '100%'}, 1, 2);	
			generateScroll('result-list', content.querySelector('.test_block'), {height: 'calc(100% - 8.3vh)', width: '100%'}, 1, 2);
		}
	);
}

function addTestLine(data, layout)
{
	let div = document.createElement('div');
	div.classList.add('test_test');
	div.innerHTML = 
	`
	<p class = 'testName table'>${data.test_name}</p>
	<p class = 'testStat table'>${data.answers? '<i style = "color:lightgreen">Выполнено</i>': '<i style = "color:red">Не выполнено</i>'}</p>
	<p class = 'testDate table'>${getDateName(data.dt)}</p>
	<p class = 'testLevel table'>${data.lvl_name}</p>
	<p class = 'actions table actions1'>${data.answers? '<button class="ended" title="Подробно">' + data.count + ' %</button>':'<button title="Начать" class="ended home-work__button">Выполнить</button>'}</p>
	`;
	if(!data.count || !data.answers) div.querySelector('.actions1').addEventListener('click', function(e) { goto(`test/${data.test_id}`); });

	layout.appendChild(div);
}

function clearCourses(layout)
{
	let c = layout.children;
	
	for(let i=0; i<c.length; i++)
		c[i].classList.remove('test_course_current');
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