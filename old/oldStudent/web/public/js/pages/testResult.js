function getResultPageTest(id) {
	POST('/test', `method=GET-RESULT&&test_id=${id}`, function(res, status){
		count = 0;
		corAns = 0;
		content.innerHTML = 
		`
		<div class="contentTest">
			<div class = 'testBlock'></div>
		</div>
		`;
		let test = document.querySelector('.testBlock'); 
		let dataTest = res.testInfo;
		for (var i = 0; i < dataTest.length ; i++) {
			dataTest[i].variants = dataTest[i].variants.split('%%');
		}
		addTesterResult(dataTest, test, res.testName, res.result);
	});	
}


//Глобальные переменные
	let counter_div = 0;
	let dataTester = {}; 
	window.count = 0;
	window.corAns = 0;
//Функция создает тело
function addTesterResult(data, layout, name, result)
{
	dataTester = data;		
	let title = document.createElement('div');
	title.classList.add('testTitle');
	title.innerHTML = `<span>Тест: ${name}</span>`;
	layout.appendChild(title);
	let questions = data;
	let div = document.createElement('div');
	div.classList.add('testBody');
	div.id = 'testBody';
	result.answers = JSON.parse(result.answers);
	for(let i = 0; i<questions.length; i++){
		addQuestionerResult(questions[i], result.answers[i].correct, div, i+1);
		count++;
	}

	addTestControlPanelerResult(title, div, data.id, data);
	layout.appendChild(div);
}
//Функция создает вопросы
function addQuestionerResult(data, result, layout, num)
{
	let div = document.createElement('div');
	div.classList.add('test_question');
	div.id = data.quest_id;
	div.innerHTML =  `<div class = 'questTitle'>${num}. ${data.quest_title}</div>`;
	
	let ans = false;
	if(data.correct == result){
		ans = true;
	}
	let color;
	layout.appendChild(div);
	for(let i=0; i<data.variants.length; i++) {
		if(i+1 == getInt(data.correct)){
			color = 'rgba(95, 175, 75, 1)';
			if(ans) corAns++;
		}else if(ans == false && i+1 == getInt(result)){
			color = 'rgba(220, 75, 75, 1)';
		}else{
			color = 'none';
		}
		if(data.variants[i] !== ''){
			addAnswererResult(data.variants[i], i+1, result,  div, num, color);	
		}
	}
}
//Функция создает ответы
function addAnswererResult(data, i, result, layout, id, color)
{
	let p = document.createElement('p');
	p.classList.add('test_answer');
	let span = document.createElement('span');
	i = getChar(i);
	span.innerHTML = `<span>${i}) </span><span>${data}</span>`;
	span.style.padding = '0 1vw';
 	if(color) span.style.color = color;
	p.appendChild(span);
	p.addEventListener('click', ()=>{ p.querySelector('input').click(); });
	layout.appendChild(p);
}
//Функция создает кнопку и блоки с описанием цветных полосочек
function addTestControlPanelerResult(layout, layoutbody, id, data)
{
	if (counter_div % 2 == 0) {
		let div = document.createElement('div');
		div.classList.add('test_control');
		div.innerHTML = `
			<span>${corAns} / ${count}</span>
			<button class = 'test_button home-work__button' id = 'escape'>Назад</button>
		`;


		div.querySelector('#escape').addEventListener('click', (e)=>{goto('tests')});

		layout.appendChild(div);
	}
}
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
			default: return 26;
		}
	}

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