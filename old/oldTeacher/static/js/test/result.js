	//Глобальные переменные
	let ForSortNameTest = false;
	let ForSortDateTest = false;
	let ForSortLvlTest = false;
	let ForSortTitleTest = false;
	let arrowSortNameTest;
	let arrowSortDateTest;
	let arrowSortLvlTest;
	let arrowSortTitleTest;

	//Запускаем основную функцию
	createHeader();

	//Функция для хедера
	function createHeader(){
		let head = document.getElementById('list__header');
		head.innerHTML = `
		<div class="table-row" style="height: 100%">
			<div class="table-cell table-cell_width10">№</div>
			<div class="table-cell">Имя студента<img class="arrowSort" id="arrowSortNameTest" onclick="sortOn(ForSortNameTest, 'firstname', arrowSortNameTest)" src="static/img/minus.svg"></div>
			<div class="table-cell"> Тест<img class="arrowSort" id="arrowSortTitleTest" onclick="sortOn(ForSortTitleTest, 'test_name', arrowSortTitleTest)" src="static/img/minus.svg"></div>
			<div class="table-cell">Уровень теста<img class="arrowSort" id="arrowSortLvlTest" onclick="sortOn(ForSortLvlTest, 'lvl_name', arrowSortLvlTest)" src="static/img/minus.svg"></div>
			<div class="table-cell table-cell_width15">Оценка теста</div>
			<div class="table-cell table-cell_width15">Дата<img class="arrowSort" id="arrowSortDateTest" onclick="sortOn(ForSortDateTest, 'dt', arrowSortDateTest)" src="static/img/minus.svg"></div>
		</div>
		`;

		arrowSortNameTest = document.getElementById('arrowSortNameTest');
		arrowSortDateTest = document.getElementById('arrowSortDateTest');
		arrowSortLvlTest = document.getElementById('arrowSortLvlTest');
		arrowSortTitleTest = document.getElementById('arrowSortTitleTest');
		generateScroll('list__header', document.querySelector('.container'), {height: '12%', width:'100%'}, 1,2);
		sortOn(ForSortDateTest, 'dt', arrowSortDateTest);
	}

	//Функция для сортировки
	function sortOn(ForSort, state, thisid)
	{
		// console.log(thisid.id);
		POST('/result', 'method=GET', function(req){
			if(req.status == 200)
			{
				let resultList = document.createElement('div');
				resultList.id = "resultList";
				let res = JSON.parse(req.response);
				let result = res.result;
				document.getElementById('result-list').innerHTML='';
				if(state =='dt'){
					result.sort(function(a,b){
						if(a.dt<b.dt)return 1;
						if (a.dt>b.dt) return -1;
						return 0;
					});
					ArrowReverse(arrowSortNameTest,arrowSortTitleTest,arrowSortLvlTest,arrowSortDateTest);
					ForSortDateTest = !ForSortDateTest;
				}else if(state == 'firstname'){
					result.sort(function(a,b){
						if(a.firstname>b.firstname)return 1;
						if (a.firstname<b.firstname) return -1;
						return 0;
					});
					ArrowReverse(arrowSortDateTest,arrowSortTitleTest,arrowSortLvlTest,arrowSortNameTest);
					ForSortNameTest = !ForSortNameTest;
				}else if (state == 'lvl_name') {
					result.sort(function(a,b){
						if(a.lvl_name>b.lvl_name)return -1;
						if (a.lvl_name<b.lvl_name) return 1;
						return 0;
					});
					ArrowReverse(arrowSortNameTest,arrowSortTitleTest,arrowSortDateTest,arrowSortLvlTest);
					ForSortLvlTest =!ForSortLvlTest;
				}else if (state == 'test_name') {
					result.sort(function(a,b){
						if(a.test_name>b.test_name)return 1;
						if (a.test_name<b.test_name) return -1;
						return 0;
					});
					ArrowReverse(arrowSortNameTest,arrowSortDateTest,arrowSortLvlTest,arrowSortTitleTest);
					ForSortTitleTest =!ForSortTitleTest;
				}else{
					return false;
				}
				if(ForSort){
					result = result.reverse();
					thisid.style.transform = 'rotate(-90deg)';
				}else{
				thisid.style.transform = 'rotate(90deg)';
				}

				let testBody = [];
				let testB = '';
				for(let i = 0; i< result.length; i++)
				{
					let percent = '/ 100';
					let part = result[i].count;
					let date = getDateName(result[i].dt);
					let answers = result[i].answers;
					testBody[i] = result[i].body;
					if(!answers){
						part = 'Тест не начат';
						percent = '';
					}else{
						percent = ' %';
					}
					testB = testBody;
					resultList.innerHTML +=
					 `
					<div class="table-row" id="table-row">
						<div class="table-cell table-cell_width10">${i+1}</div>
						<div class="table-cell">${result[i].firstname} ${result[i].lastname}</div>
						<div class="table-cell"><span>${result[i].test_name}</span></div>
						<div class="table-cell">${result[i].lvl_name}</div>
						<div class="table-cell table-cell_width15 table-result-procent" id="table-result-procent"> ${answers ? '<a href="/testresult?student=' + result[i].student_id + '?test=' + result[i].test_id + '"><button class="home-work__button" onmouseout="repaintAssessment(this) " onmouseover="paintAssessment(' + part +',this)" id=table-result-button'+i+'>' + part + percent + '</button></a>' : part + percent}</div>
						<div class="table-cell table-cell_width15">${date}</div>
					</div>
					`;
				}
				document.getElementById('result-list').appendChild(resultList)
				generateScroll('resultList', document.querySelector('.container'), {height: '88%', width:'100%'}, 1,2);
		}

		});
	}	

	//Функция убирает неактивные стрелки
	function ArrowReverse(firstarrow,secondarrow,thirdarrow,fourarrow){
		console.log(firstarrow)
		firstarrow.style.transform = 'rotate(0deg)';
		secondarrow.style.transform = 'rotate(0deg)';
		thirdarrow.style.transform = 'rotate(0deg)';
		fourarrow.src = "static/img/playbutton.svg";
		setTimeout(function(){
		firstarrow.src = "static/img/minus.svg";
		secondarrow.src = "static/img/minus.svg";
		thirdarrow.src = "static/img/minus.svg";
		},400);
}

	//Функция закрашивает оцену
	function paintAssessment(part,button){
		button.style.color = "#5ba3ea";
		if(part >= 0 && part<= 40){
			button.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
		}else if (part >= 41 && part <= 60){
			button.style.backgroundColor = 'rgba(255, 255, 0, 0.4)';
		}else if( part >= 61 && part < 90){
			button.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
		}else if (part >= 90 && part <= 100){
			button.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
		}else{
			button.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
		}
	}

	//Функция открашивает оценку
	function repaintAssessment(button){
		button.style.color = '#85a4af';
		button.style.backgroundColor = 'transparent';
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
