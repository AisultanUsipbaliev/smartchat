//Глобальные переменные
let ForSortStatus = false;
let ForSortDate = false;
let ForSortName = false;
let arrowSortName;
let arrowSortStatus;
let arrowSortDate;
 
//Старт функции
createHeader();

//Функция создает хедер
function createHeader(){
	console.log('popal')
	let head = document.getElementById('list__header');
	head.innerHTML=`
	<div class="table-row">
		<div class="table-cell table-cell_width10">№</div>
		<div class="table-cell table-cell_width30">Студент<img class="arrowSort" id="arrowSortName" onclick="sortOn(ForSortName, 'firstname', arrowSortName)" src="static/img/minus.svg"></div>
		<div class="table-cell">Статус<img class="arrowSort" id="arrowSortStatus" onclick="sortOn(ForSortStatus, 'files', arrowSortStatus)" src="static/img/minus.svg"></div>
		<div class="table-cell">Оценить</div>
		<div class="table-cell">Дата<img class="arrowSort" id="arrowSortDate" onclick="sortOn(ForSortDate, 'dt', arrowSortDate)" src="static/img/minus.svg"></div>
	</div>
	`;

	arrowSortName = document.getElementById('arrowSortName');
	arrowSortStatus = document.getElementById('arrowSortStatus');
	arrowSortDate = document.getElementById('arrowSortDate');
	generateScroll('list__header', document.querySelector('.container'),{height: '12%', width: '100%'}, 1, 2);
	sortOn(ForSortDate, 'dt', arrowSortDate);
}

//Функция сортировки
function sortOn(ForSort, state, thisid){
	POST("/result","method=GET-HOMEWORK",function(req){
		let div = document.createElement('div');
		div.id = 'bodyContainer';
		if(req.status == 200)
		{
			let res = JSON.parse(req.response);
			if (state == "firstname") {
				res.result.sort(function(a,b){
					if(a.firstname>b.firstname)return 1;
					if (a.firstname<b.firstname) return -1;
					return 0;
				});
				ArrowReverse(arrowSortStatus,arrowSortDate,arrowSortName);
				ForSortName = !ForSortName;
				ForSortDate = false;
				ForSortStatus = false;
			}else if (state == "dt"){
				res.result.sort(function(a,b){
					if(a.dt<b.dt)return 1;
					if (a.dt>b.dt) return -1;
					return 0;
				});
				ArrowReverse(arrowSortName,arrowSortStatus,arrowSortDate);
				ForSortDate =!ForSortDate;
				ForSortName = false;
				ForSortStatus = false;
			}else if (state == "files") {
				res.result.sort(function(a){
					if(a.filePath){return -1}
					else {return 1}
					return 0;
				});
				ArrowReverse(arrowSortName,arrowSortDate,arrowSortStatus);
				ForSortStatus =!ForSortStatus;
				ForSortDate = false;
				ForSortName = false;
			}else{
				
				return false;
			}
			let file = null;
			let check = 0;
			let nameStudent = '';
			let date = '';
			let number = 1;
			if (ForSort) {
				res.result = res.result.reverse();
				thisid.style.transform = 'rotate(-90deg)';
			}else{
				thisid.style.transform = 'rotate(90deg)';
			}
			for (var i = 0; i < res.result.length; i++) {
				nameStudent = res.result[i].firstname + ' ' + res.result[i].lastname;
				file = res.result[i].filePath;
				score = res.result[i].score;
				check = res.result[i].checked;
				date = getDateName(res.result[i].dt);
				div.innerHTML += 
				`
				<div class="table-row">
				<div class="table-cell table-cell_width10">${number}</div>
				<div class="table-cell table-cell_width30">${nameStudent}</div>
				<div class="table-cell">${file ? `<a target="blank" href="/common/files/${file}"><button class = "home-work__button">Посмотреть</button></a>` : 'Не выполненно'}</div>
				<div class="table-cell" id="but${res.result[i].id}">
				${file ? (score 
					? score 
					: `<button class="home-work__button" onclick="assesmentHW(${res.result[i].id}, ${check}, 'but${res.result[i].id}')">Оценить</button>`) : 'Не доступно'}	
				</div>
				<div class="table-cell">${date}</div>
				</div>
				`
				number++;
				}
			}else{
				div.innerHTML = '<div class="nopeResult">У вас нет студентов с домашним заданием</div>'
			}
			document.querySelector('.container').appendChild(div);
			generateScroll('bodyContainer', document.querySelector('.container'),{height: '88%', width: '100%'}, 1, 2);
	});

}

//Функция позволяет оценить дз
function assesmentHW(thisid,check,layoutid){
	if(layoutid.id) layoutid = layoutid.id;
	let layout = document.getElementById(layoutid);
	layout.innerHTML =
	`
	<select type="number" class="assessment" id="select">
		<option value="1">1</option>
		<option value="2">2</option>
		<option value="3">3</option>
		<option value="4">4</option>
		<option value="5">5</option>
		<option value="6">6</option>
		<option value="7">7</option>
		<option value="8">8</option>
		<option value="9">9</option>
		<option value="10">10</option>
	</select>
	<img class="deleteImg" src="static/img/complete.png" onclick="saveAssessment(${thisid}, select, ${check}, ${layoutid})">
	<img class="deleteImg" src="static/img/if_close2_1814078.png" style="height:5vh; width:5vh" onclick="closeAssessment(${thisid},${check},${layoutid})">
	`
}

//Функция сохроняет оценку
function saveAssessment(thisid, select, check, layoutid){
	POST('/result','method=TAKE-ASSESSMENT&id='+thisid+'&score='+select.value,function(res){
		if(res.status == 200){
			console.log(layoutid)
		if(layoutid.id) layoutid = layoutid.id;
		let layout = document.getElementById(layoutid);
		layout.innerHTML = `${select.value}`;
		}else console.log(res.response)
	});
}

//Функция закрывает оценку.
function closeAssessment(thisid,check,layoutid){
	if(layoutid.id) layoutid = layoutid.id;
	document.getElementById(layoutid).innerHTML =
	`
	<button class="home-work__button" onclick="assesmentHW(${thisid},${check},${layoutid})">Оценить</button>	
	`
}

//Функция убирает неактивные стрелки
function ArrowReverse(firstarrow,secondarrow,thirdarrow){
	firstarrow.style.transform = 'rotate(0deg)';
	secondarrow.style.transform = 'rotate(0deg)';
	thirdarrow.src = "static/img/playbutton.svg";
	setTimeout(function(){
	firstarrow.src = "static/img/minus.svg";
	secondarrow.src = "static/img/minus.svg";
	},400);
}

//Функция возвращает время
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