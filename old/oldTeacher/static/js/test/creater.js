//Глобальные переменные
let test_id = 0;
let cont = document.getElementById('containerCreate');

//Скрипт
getCreateLayout(); 
// Функция открывает страницу создать тест
	function getCreateLayout()
	{
		let id = window.location.search.slice(1).split('=')[1];
		if(id) test_id = id;

		cont.innerHTML = '<div class = "top">'+
				'<div id = "lvl" class = "lvl" title="Уровень теста"><h4 id = "lvl_name">Выберите уровень</h4><img src="static/img/right.svg" class="strelka"></div>'+
				'<div class = "lvls" id = "lvls" style="display: none;"></div>'+
				'<input type="text" title="Название теста" id = "test_name" class="test_name input" placeholder = "Название теста">'+
				'<img src="static/img/blue_plus.png" title="Добавить вопрос" id = "blue_plus" class = "blue_plus">'+
				'<img src="static/img/complete.png" title="Сохранить" class = "complete_btn">'+
				'<img src="static/img/close.png" title="Отмена" class = "close_btn">'+
				'</div>'+
				'<div class="questions" id = "questions"></div>';

		generateScroll('questions', cont, {height: '72vh', width:'100%'}, 1, 1);

		document.getElementById('lvl').addEventListener('click', ()=>
		{
			if(lvls.style.display == 'none') lvls.style.display = 'block';
			else lvls.style.display = 'none';
			getLevels();
		});

		// Добавляем вопрос нажатием на +
		document.getElementById('blue_plus').addEventListener('click', ()=>
			{
				let n = document.getElementById('questions').children.length;
				addQuest(n+1);
			});
		// Закрываем создание вопроса
		document.querySelector('.close_btn').addEventListener('click', ()=>
			{
				if(confirm('Вы уверены, что хотите закрыть эту страницу?'))
				top.location.href = "/test"
			});

		//Создаем тест
		document.querySelector('.complete_btn').addEventListener('click', ()=>
			{
				createTest();
			});

		if(id)
		{
			POST('/test', 'method=GET&&test_id=' + id, (req)=>
			{
				let res = JSON.parse(req.response);

				let body = res.body[0];
				document.getElementById('lvl_name').innerHTML = body.lvl_name;
				document.getElementById('lvl').setAttribute('lvl_id', body.lvl_id);
				document.getElementById('test_name').value = body.test_name;

				let quests = res.quest;

				for(let i = 0; i<quests.length; i++)
				addQuest(i+1, quests[i].quest_title, quests[i].weight, quests[i].variants, quests[i].correct); 
			});
		}
		else
		{
			addQuest(1); 
			addQuest(2);
		}
	};

// Функция создает тест
	function createTest()
	{	
		let lvl = '';
		let name = '';
		let mas  = [];
		let level_el = document.getElementById('lvl');
		if(!level_el.getAttribute('lvl_id'))
		{
			level_el.style.color = 'red';
			notifier('Выберите уровень!', 'red');
			return;
		}
		else
		{
			level_el.style.color = 'black';
		}

		lvl = level_el.getAttribute('lvl_id');
		name = document.getElementById('test_name').value;
		if(name.length < 1)
		{
			document.getElementById('test_name').style.background = 'linen';
			notifier('Введите имя теста!', 'red');
			return;
		}
		else
		{
			document.getElementById('test_name').style.background = 'transparent';
		}

		let questions = document.getElementById('questions');
		if(questions.children.length == 0)
		{
			notifier('Создайте вопрос', 'red');
		}

		let children = questions.children;

		if(children.length < 2)
		{
			notifier('В тесте может быть минимум 2 вопроса!', 'red');
			return;
		}
		for(let i = 0; i<children.length; i++)
		{
			let ms = [];
			let question = children[i];

			let left = question.children[0];

			let quest = left.children[1].value;
			if(quest.length < 1) 
			{
				left.children[1].style.background = 'linen';
				notifier('Введите вопрос!', 'red');
				return;
			}
			else
			{
				ms.push(quest);
				left.children[1].style.background = 'transparent';
			}

			let weight = left.children[2].value;

			if(weight < 1) 
			{
				left.children[2].style.background = 'linen';
				notifier('Введите вес вопроса!', 'red');
				return;
			}
			else
			{
				ms.push(weight);
				left.children[2].style.background = 'transparent';
			}

			let right = question.children[1];

			let answers = right.children[1].children;
			for(let j = 0; j<answers.length; j++)
			{
				let input = answers[j].children[0];
				let val = input.value;
				if(val < 1)
				{
					input.style.background = 'linen';
					notifier('Введите ответ!', 'red');
					return;
				}
				else
				{
					input.style.background = 'transparent';
					ms.push(val);
				}
			}
			let ok = false;
			let variants = right.children[0].children;
			for(let j = 0; j<variants.length; j++)
			{
				let img = variants[j].children[0];
				let ii = img.src.split('/');
				if(ii[ii.length-1] == 'chosen.svg')
				{
					ms.push(getChar(j+1));
					ok = true;
				}
			}

			if(!ok)
			{
				notifier('Выберите правильный ответ!', 'red');
				right.children[0].style.background = 'linen';
				return;
			}
			else
			{
				right.children[0].style.background = 'transparent';
			}
			mas.push(ms);
			mas.push('%%');
		}
		POST('/test', 'method=POST&&name='+name+'&&lvl='+lvl+'&&mas='+mas + '&&test_id='+test_id, (req)=>
			{
				if(req.status == 200)
				{
					notifier('Тест успешно сохранен!', 'green');
					top.location.href = "/test"
				}
				else
				{
					console.log(req.response)
				}
			});
	}


// Функция достает уровни
	function getLevels()
	{
		let lvl_name = document.getElementById('lvl_name');
		let lvl = document.getElementById('lvl');
		let lvls = document.getElementById('lvls');
		POST('/level', 'method=GET', (req)=>
			{
				lvls.innerHTML = '';
				let res = JSON.parse(req.response);
				if(req.status == 200)
				{
					let body = res.body;
					for(let i = 0; i<body.length - 1; i++)
					{
						let div = document.createElement('div');
						div.id = body[i].lvl_id;
						div.innerHTML = body[i].lvl_name;
						div.classList.add('lvl_name');

						div.addEventListener('click', (e) => 
						{
							lvls.style.display = 'none';
							lvl.innerHTML = "<h4 id = 'lvl_name'>"+e.target.innerHTML+"</h4><img src='static/img/right.svg' class='strelka'>";
							lvl.setAttribute('lvl_id', e.target.id);
						});

						lvls.appendChild(div);
					}
				}
				else if(req.status == 202)
				{
					notifier('Ни одного уровня нет', 'red');
				}
				else
				{
					console.log(res);
				}
			});
	};

// Функция создает вопрос
	function addQuest(i, q_title, q_weight, q_variants, q_correct) 
	{
		let questions = document.getElementById('questions');

		let test_block = document.createElement('div');
		test_block.classList.add('test_block');

		let left_block = document.createElement('div');
		left_block.classList.add('left_block');

		let a = document.createElement('a');
		a.classList.add('numer');
		a.innerHTML = i + '.';

		let quest_name = document.createElement('input');
		quest_name.classList.add('quest_name');
		quest_name.classList.add('input');
		quest_name.placeholder = 'Вопрос';
		quest_name.type = 'text';

		if(q_title) quest_name.value = q_title;

		let quest_weight = document.createElement('input');
		quest_weight.classList.add('quest_weight');
		quest_weight.classList.add('input');
		quest_weight.placeholder = 'Вес вопроса';
		quest_weight.type = 'number';

		if(q_weight) quest_weight.value = q_weight;

		left_block.appendChild(a);
		left_block.appendChild(quest_name);
		left_block.appendChild(quest_weight);

		let answers_block = document.createElement('div');
		answers_block.classList.add('answers_block');

		let variants = document.createElement('div');
		variants.classList.add('variants');

		let answers = document.createElement('div');
		answers.classList.add('answers');

		answers_block.appendChild(variants);
		answers_block.appendChild(answers);

		test_block.appendChild(left_block);
		test_block.appendChild(answers_block);
		test_block.id = 'q=' + i;
		questions.appendChild(test_block);

		if(q_variants)
		{
			let variant = q_variants.split('%%');
			for(let i = 0; i<variant.length-1; i++)
			{
				addAns(answers_block, variant[i], q_correct)
			}
		}
		else
		{
			addAns(answers_block);
			addAns(answers_block);
		}
	}

// Функция добавляет еще один ответ в блок
	function addAns(answers_block, q_variant, q_correct)
	{	
		let parent = answers_block.parentNode;
		let id = parent.id;
		let answers = answers_block.children[1];
		let variants = answers_block.children[0];

		let div = document.createElement('div');
		div.classList.add('ans');

		let input = document.createElement('input');
		input.classList.add('answer');
		input.classList.add('input');

		if(q_variant) input.value = q_variant;

		let children = answers.children;
		if(children.length > 0)
		{
			changeAns(children[children.length-1])
		}

		let add = document.createElement('img');
		add.classList.add('add_ans');
		add.src = "static/img/blue_plus.png";
		add.title = "Добавить ответ";
		add.addEventListener('click', (e)=>
			{
				addAns(e.target.parentNode.parentNode.parentNode);
			});	

		let goUp = document.createElement('img');
		goUp.classList.add('goUp');
		goUp.src = "static/img/goUp.png" ;
		goUp.title = "Вверх";
		let a = document.createElement('a');
		a.href = '#'+id;
		a.appendChild(goUp);

		let close = document.createElement('img');
		close.classList.add('delete_ans');
		close.src = 'static/img/close.png';
		close.title = 'Удалить вопрос';
		close.addEventListener('click', (e)=>
			{
				let one = e.target.parentNode;
				let two = one.parentNode;
				let three = two.parentNode;
				let four = three.parentNode;
				let five = four.parentNode;

				five.removeChild(four);

				let children = five.children;
				for(let i = 0 ; i< children.length; i++)
				{
					let one = children[i].children[0];
					let a = one.children[0];
					let n = i+1;
					a.innerHTML = ' ' + n + '.'; 
				}
			});

		div.appendChild(input);
		div.appendChild(add);
		div.appendChild(a);
		div.appendChild(close);

		answers.appendChild(div);


		//Работаем с вариантами ответов
		let variant = document.createElement('div');
		variant.classList.add('variant');
		let chb = document.createElement('img');
		chb.classList.add('checkbox');
		chb.src = 'static/img/choose.svg';

		let lab = document.createElement('a');
		let n = variants.children.length +1;
		lab.innerHTML = getChar(n) + ')';
		if(n == getInt(q_correct))
		{
			chb.src = 'static/img/chosen.svg';
		}
		variant.appendChild(chb);
		variant.appendChild(lab);

		variant.addEventListener('click', (e)=>
		{
			let mas = chb.src.split('/');
			if(mas[mas.length-1] == 'chosen.svg')
			{
				chb.src = 'static/img/choose.svg';
			}
			else
			{
				let ch = variants.children;
				for(let i = 0; i<ch.length; i++)
				{
					let im = ch[i].children[0];
					im.src = 'static/img/choose.svg';
				}

				chb.src = 'static/img/chosen.svg';
			}
		});
		variants.appendChild(variant);
	}

// Функция меняет ответ с последнего...
	function changeAns(ans)
	{
		let input = ans.children[0];
		ans.innerHTML = '';
		ans.appendChild(input);
		let img = document.createElement('img');
		img.src = "static/img/close.png";
		img.title = 'Удалить ответ';
		img.classList.add('delete_ans-ord');
		img.addEventListener('click', (e)=> { deleteAns(e.target); });
		ans.appendChild(img);
	}

// Функция удаляет ответ 
	function deleteAns(i)
	{
		let parent = i.parentNode;
		let grandparent = parent.parentNode;

		grandparent.removeChild(parent);

		let ans_block = grandparent.parentNode;	
			
		let block = ans_block.children[0];
		let variants = block.children;

		block.removeChild(variants[variants.length-1]);

	}

// Функция возвращает символ 
	function getChar(i) 
	{
		switch(i)
		{
			case 1: return 'a';
			case 2: return 'b';
			case 3: return 'c';
			case 4: return 'd';
			case 5: return 'e';
			case 6: return 'f';
			case 7: return 'g';
			case 8: return 'h';
			case 9: return 'i';
			case 10: return 'j';
			case 11: return 'k';
			case 12: return 'l';
			case 13: return 'm';
			case 14: return 'n';
			case 15: return 'o';
			case 16: return 'p';
			case 17: return 'q';
			case 18: return 'r';
			case 19: return 's';
			case 20: return 't';
			case 21: return 'u';
			case 22: return 'v';
			case 23: return 'w';
			case 24: return 'x';
			case 25: return 'y';
			default: return 'z';
		}
	}

// Функция возвращает номер символа 
	function getInt(i) 
	{
		switch(i)
		{
			case 'a': return 1;
			case 'b': return 2;
			case 'c': return 3;
			case 'd': return 4;
			case 'e': return 5;
			case 'f': return 6;
			case 'g': return 7;
			case 'h': return 8;
			case 'i': return 9;
			case 'j': return 10;
			case 'k': return 11;
			case 'l': return 12;
			case 'm': return 13;
			case 'n': return 14;
			case 'o': return 15;
			case 'p': return 16;
			case 'q': return 17;
			case 'r': return 18;
			case 's': return 19;
			case 't': return 20;
			case 'u': return 21;
			case 'v': return 22;
			case 'w': return 23;
			case 'x': return 24;
			case 'y': return 25;
			default : return 0;
		}
	}
