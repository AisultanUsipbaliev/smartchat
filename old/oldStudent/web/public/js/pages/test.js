function getPageTest(id){
	window.test_id = id;
	POST('/test', `method=GET-TEST&&test_id=${id}`, function(res) {
		content.innerHTML = 
		`
		<div class="contentTest">
			<div class = 'testBlock'></div>
		</div>
		`;
		let test = document.querySelector('.testBlock'); 
		let dataTest = res.data;
		for (var i = 0; i < dataTest.length ; i++) {
			dataTest[i].variants = dataTest[i].variants.split('%%');
		}
		addTester(dataTest, test, res.name);
	});
}

//Глобальные переменные
	let div_counter = 0;
	let testDataer = {};

//Функция создает тело
function addTester(data, layout,name)
{
	testDataer = data;		
	let title = document.createElement('div');
	title.classList.add('testTitle');
	title.innerHTML = `<span>Тест: ${name}<span>`;
	layout.appendChild(title);
	let questions = data;
	let div = document.createElement('div');
	div.classList.add('testBody');
	div.id = 'testBody';
	for(let i = 0; i<questions.length; i++)
		addQuestioner(questions[i], div, i+1);

	addTestControlPaneler(title, div, data.id);
	layout.appendChild(div);
}
//Функция создает вопросы
function addQuestioner(data, layout, num)
{
	let div = document.createElement('div');
	div.classList.add('test_question');
	div.id = data.quest_id;
	div.innerHTML =  `<div class='questTitle'>${num}. ${data.quest_title}</div>`;
	
	layout.appendChild(div);

	for(let i=0; i<data.variants.length; i++) {
		if(data.variants[i] !== ''){
			addAnswerer(data.variants[i], div, num, i+1);	
		}
	}
}
//Функция создает ответы
function addAnswerer(data, layout, id, num)
{
	let p = document.createElement('p');
	p.classList.add('test_answer', 'active');
	num = getChar(num);
	p.innerHTML = `<input type = 'radio' class = 'active' name = '${id}'>${num}) <span>${data}</span>`;
 
	p.addEventListener('click', ()=>{ p.querySelector('input').click(); });
	layout.appendChild(p);
}
//Функция создает кнопки и проверяет их нажантие
function addTestControlPaneler(layout, layoutbody, id)
{
	if (div_counter % 2 == 0) {
		let div = document.createElement('div');
		div.classList.add('test_control');
		div.innerHTML = `
			<button class = 'test_button home-work__button' id = 'save'>Отправить</button>
			<button class = 'test_button home-work__button' id = 'escape'>Отмена</button>
		`;


		div.querySelector('#escape').addEventListener('click', (e)=>{goto('tests')});

		div.querySelector('#save').addEventListener('click', (e)=>
			{
				sendTester(layoutbody, id);
			});

		layout.appendChild(div);
	}
	// div_counter++;

}
//Функция проверяет тест и отпровляет на сервер
function sendTester(layout, id)
{
	if(validateTester(layout))
	{
		let question = [];
		let answers = [];
		let correct = 0;
		let resultbody = [];
		let obj = {};

		for (var i = 0; i < layout.children.length; i++) 
		{
			for (var j = 1; j < layout.children[i].children.length; j++) 
			{
				answers[j-1] = layout.children[i].children[j].children[1].innerHTML;
				if(layout.children[i].children[j].children[0].checked) correct = getChar(j);
	 		}

			obj = 
			{
				quest_id: layout.children[i].id,
				correct: correct
			}

			resultbody[i] = obj;
			correct = [];
	 	}
	 	
	 	resultbody = JSON.stringify(resultbody);
		POST('/test', `method=RESULT&&test_id=${window.test_id}&&result=${resultbody}`, (res, status)=>
		{
			if(status === 200){
				showPopup(`<div class="popContent">
							<h3>Ваш результат: ${res.result^0}</h3>
							<button class="hw-body__button" onclick="closePopup()">Хорошо</button>
						   <div>`,
				 {width:'20vw', height:'15vh', top: '20vh', background: '#fff'});
				setTimeout(function(){goto(`testresult/${window.test_id}`)},1500);
			}
		});

	}
	else
	{
		let testBody = document.getElementById('testBody');
		for (var i = 0; i < testBody.children.length; i++) 
			if (testBody.children[i].children[1].style.backgroundColor == 'linen') 
			{
				document.getElementById(`${testBody.children[i].id}`).scrollIntoView();
				break;
			}
	}
}

//Функция проверяет отвечены ли все вопросы
function validateTester(layout)
{
	let layout1 = layout.children;
	let answers = [];
	let check = true;

	for (var i = 0; i < layout1.length; i++) {
		for (var j = 1; j < layout1[i].children.length; j++) {
			if(layout1[i].children[j].children[0].checked){	
				for (var q = 1; q < layout1[i].children.length; q++) {
					layout1[i].children[q].style.background = 'white';	
				}			
				answers[i] = layout1[i].children[j].children[0];
				j = layout1[i].children.length;
				check = true;
			}else{
				for (var q = 1; q < layout1[i].children.length; q++) {
					layout1[i].children[q].style.background = 'linen';	
					check = false;
				}
			}
		}
	}
	for (var i = 0; i < layout1.length; i++) {
		for (var q = 1; q < layout1[i].children.length; q++) {
			if(layout1[i].children[q].style.background == 'linen'){
				check = false;
			}
		}
	}
	return check;
};  

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