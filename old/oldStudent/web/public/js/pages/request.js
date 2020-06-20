let standartTime = {start: 8, finish: 22}

function getRequestPage(id)
{
	content.innerHTML = `<div class = 'MainContent'></div>`;
	let main = content.querySelector('.MainContent');
	POST('/course', 'method=GET&&rate_id='+id, (res)=>
		{
			if (res.status == 200) 
			{
				let data = res.rateInfo;
				CourseContent({
					rId:data.rate_id,
					rName:data.rate_name,
					cost:data.rate_cost,
					lessons:data.lessons
				}, main);
			} 
			else top.location.href = '/courses';
		});

	window.rate 	= id;
	window.min 		= null;
	window.request 	= null;
}
function CourseContent(data, layout)
{ 
	let head = document.createElement('div');
		head.classList.add('MainCourseHead');
		head.innerHTML = `<div class="MainCourseName">Курс: ${data.rName}</div>`;

	layout.appendChild(head);

	let div = document.createElement('div');
		div.classList.add('MainCourseBody', 'hidden_scroll');
		div.innerHTML =``;

	getRequest(div,data);

	SCROLL(div, div.scrollHeight);

	layout.appendChild(div);
	
	min = data.lessons/4;
}

function SCROLL(block, height)
{
	let z = 1;
	let interval = setInterval(()=>
		{
			block.scrollTo(0, z);
			z+= 3;
			if(z > height/2 +100) clearInterval(interval);
		},1)
}

function getRequest(layout,data)
{
	let div = document.createElement('div');
	div.id = 'request';
	div.classList.add('requestBlock');

	div.innerHTML = `
	<h3 class = 'requestTitle'>Укажение удобное время для прохождения занятия:</h3>
	<div class = 'requestDays'>
		<hr>
		<div class = 'requestDayName'>Понедельник</div> <img src = '/img/plus.png' id = 'img1' onclick = 'addSelector(1)'>
		${addDay(1)}
		<hr>
		<div class = 'requestDayName'>Вторник</div> <img src = '/img/plus.png' id = 'img2' onclick = 'addSelector(2)'>
		${addDay(2)}

		<hr>
		<div class = 'requestDayName'>Среда</div> <img src = '/img/plus.png' id = 'img3' onclick = 'addSelector(3)'>
		${addDay(3)}

		<hr>
		<div class = 'requestDayName'>Четверг</div> <img src = '/img/plus.png' id = 'img4' onclick = 'addSelector(4)'>
		${addDay(4)}

		<hr>
		<div class = 'requestDayName'>Пятница</div> <img src = '/img/plus.png' id = 'img5' onclick = 'addSelector(5)'>
		${addDay(5)}

		<hr>
		<div class = 'requestDayName'>Суббота</div> <img src = '/img/plus.png' id = 'img6' onclick = 'addSelector(6)'>
		${addDay(6)}

		<hr>
		<div class = 'requestDayName'>Воскресенье</div> <img src = '/img/plus.png' id = 'img0' onclick = 'addSelector(0)'>
		${addDay(0)}
		<hr>
	</div>
	<div class='requestControl'>
		<button class = 'MainButton requestAccept' style="display:block">Отправить</button>
	</div>`;

	div.querySelector('.requestAccept').addEventListener('click', ()=>
		{
			let requests = div.querySelector('.requestDays');
			sendRequest(requests,data);
		});

	layout.appendChild(div);
}

function addSelector(id)
{
	let block = document.getElementById(`day=${id}`);
	if(block.children.length < 9)
	{
		let start = document.createElement('select');
		start.classList.add('requestSelector');
		start.setAttribute('day', id);
		start.setAttribute('time', 0);
		start.addEventListener('change', valueChanged);		
		start.innerHTML = createInterval(id, 1, null, standartTime.finish - 1);

		let i = document.createElement('i');
		i.innerHTML = '-';

		let finish = document.createElement('select');
		finish.classList.add('requestSelector');
		finish.setAttribute('day', id);
		finish.setAttribute('time', 1);
		finish.addEventListener('change', valueChanged);		
		finish.innerHTML = createInterval(id, 1, standartTime.start + 1);

		block.innerHTML += ' И ';
		block.appendChild(start);
		block.appendChild(i);
		block.appendChild(finish);
		if(block.children.length > 7) document.getElementById(`img${id}`).style.display = 'none';
	}
}

function addDay(id, flag)
{
	let result = document.createElement('div');
	result.innerHTML = `
	<div class='dayBlock' id='day=${id}'>
	${createInterval(id, 0, null, standartTime.finish - 1)}
	<i>-</i>
	${createInterval(id, 1, standartTime.start + 1)}</div>`; 
	
	return flag == 1? result.querySelector('div').innerHTML: result.innerHTML;
}

function createInterval (day, time, start, finish) {
	if (start == null) 		start = standartTime.start;
	if (finish == null) 	finish = standartTime.finish;

	let str = `<select onchange = 'valueChanged(event)' class='requestSelector' day='${day}' time='${time}'><option>нет</option>`;

	for(let i = start; i<=finish; i++) str += `<option value = '${i}'>${i}:00</option>`

	str += '</select>'
	return str
}

function valueChanged(e)
{
	let children = e.target.parentNode.children;
	let orientation = e.target.getAttribute('time');
	let value = e.target.value;
	if(value != 'нет') {
		let changeMe; 
		for (let i = 0; i<children.length; i++) {
			if (children[i] == e.target) {
				switch (i) {
					case 0: changeMe = children[2]; break;
					case 2: changeMe = children[0]; break;
					case 3: changeMe = children[5]; break;
					case 5: changeMe = children[3]; break;
					case 6: changeMe = children[8]; break;
					case 8: changeMe = children[6]; break;
				}
			}
		}

		let existVal = changeMe.value;
		let day = changeMe.getAttribute('day');
		let time = changeMe.getAttribute('time');
		
		if (orientation == 1) 
			changeMe.innerHTML = createInterval(day, time, standartTime.start), Number(value) - 1;
		else 
			changeMe.innerHTML = createInterval(day, time, Number(value) + 1, standartTime.finish);
			
		if(existVal != 'нет')
			changeMe.value = existVal;
	}
}

function sendRequest(layout,data)
{
	let res = ValidateRequest(layout);
	if(res.status == 200)
	{
		let req = {
			request: res.requests
		};
		let UTCdifference = UTCFunc();
		let mas = [];
		for (let i = 0; i < req.request.length; i++) 
			for (let j = 0; j < req.request[i].periods.length; j++) 
				mas.push(ConvertToServ(req.request[i].periods[j], UTCdifference, req.request[i].day))
		let servmas = '';
		for (let i = 0; i < mas.length; i++){
				servmas += mas[i];
				if(i != mas.length - 1)
				servmas += ',';
		}
		request = servmas;
		POST('/request', `method=PERIODS&&rate=${rate}&&request=${request}`, (res)=>
			{
				layout = document.getElementById('request');
				if(res.status == 200)
				{
					if(res.body.length == 1)
					if(res.body[0].teacher_id != 51){
						let script = getTeachersScript(res.body,data);
						// OpenPOPuPPay(data.rName,data.cost,10);
						layout.innerHTML = script;
					}else{
						GetNotice(0, 'В это время с вами никто не может вести занятия');
					}
					else{
						let script = getTeachersScript(res.body,data);
						// OpenPOPuPPay(data.rName,data.cost,10);
						layout.innerHTML = script;
					}
				}
				else
				{
					GetNotice(0, 'В это время с вами никто не может вести занятия');
				}	
			});
	}
}

function getTeachersScript(data,dataGl)
{
	let res = '<div class="requestTeachers"><h2>По вашему запросу найдены преподаватели:</h2>';
	for (let i = 0; i < data.length; i++)
		{
			if(data[i].teacher_id != 51)
			res += `<div><p>${i+1}. ${data[i].login}</p> <p>${data[i].lastname}</p><button onclick='openCode("${dataGl.rName}",${dataGl.cost},${data[i].teacher_id},"${data[i].login} ${data[i].lastname}")'>Выбрать</button></div>`;
		};
	res += '</div>';

	return res;
}

function sendTeacher(id, inId)
{
	POST('/request', `method=SEND&&teacher=${id}&&rate=${rate}&&request=${request}&&invoiceId=${inId}`, (res)=>
		{
			if (res.status == 200) 
			{
				GetNotice('application', 'Ваша заявка принята, ожидайте уведомления о назначенном времени занятия');
				closePopup();
				goto('courses');
				ws.send(JSON.stringify({
					notice: 2,
					teacher_id: id,
					rate
				}));
			} 
			else 
			{
				GetNotice('application', 'Ваша заявка не отправленна!');
			}
			
		});
}

//Очень сложная валидация СЕЛЕКТОВ как и их структура
function ValidateRequest(layout)
{
	let days = layout.getElementsByClassName('dayBlock');
		
	let requests = [];

	for(let i=0; i<days.length; i++)
	{
		let selects = days[i].children;
		let periods = [];
		for(let j = 0; j<selects.length; j = j + 3)
		{
			let start = selects[j];
			let finish = selects[j+2];

			// start.style.background = 'buttonface';
			// finish.style.background = 'buttonface';

			if(start.value != 'нет'  && finish.value != 'нет')
			{
				if(Number(start.value) >= Number(finish.value))
				{
					start.style.background = 'linen';
					finish.style.background = 'linen';
					GetNotice(0, 'Некооректное время');
					return {status: 418};
				}
				else
				{
					let UTCdifference = UTCFunc();
					let time = 
					{
						start: 	start.value,
						finish: finish.value
					};
					periods.push(time);
				}
			}
			else if(start.value == 'нет' && finish.value == 'нет'){}
			else 
			{
				start.style.background = 'linen';
				finish.style.background = 'linen';
				GetNotice(0, 'Некорректное время!');
				return {status: 418};
			}
		}
		let day = 
		{
			day: days[i].id.split('=')[1],
			periods
		};
		requests.push(day);
	}
	let newmas = [];
	for(let i = 0; i<requests.length; i++)
	{
		if(requests[i].periods.length != 0)
		{
			newmas.push(requests[i]);
		}
	}

	let sum = 0;

	for(let i=0; i<newmas.length; i++)
		for(let j=0; j<newmas[i].periods.length; j++)
			sum ++;
	
	if(sum < min)
		{
			GetNotice(0, 'Не достаточно промежутков выбрано!');
			return {status: 418};
		}

	return {status: 200, requests: newmas};
}

let studentName = '';
POST('/student', `method=PROFILE&&id=${getCookie('SAI')}`, (res,stat)=>
		{
			if(stat == 200)
			{
				let data = res.body;
				studentName = data.firstname + ' ' + data.lastname;				
			}
			else console.log(res);
		});


var teacher;

function openCode(name, cost, id){
	if (cost <= 0) 
	{
		sendTeacher(id, '');
	}else{ 
		let script = `
			<div class="haveCourse">
				<h2 class="haveCourse-h2">Ведите промокод</h2>
				<h3 class="haveCourse-h3" id="err_code" style="display:none; color:red">Неверный код</h3>
				<input type="text" id="promo" class="profile_input">
				<div class="button-container">
					<div id='nope_code' class="twoButton twoButton-delete">У меня нет промокода</div>
					<div id='accept_code' class="twoButton twoButton-delete">Использовать</div>
				</div>
		  </div>
		`
		showPopup(script, { width: '26.5vw', height: '26.5vh', background: '#fff', top: '10vh'});
		document.getElementById('nope_code').addEventListener('click',function(e){
			closePopup();
			OpenPOPuPPay(name, cost, id)
		})
		document.getElementById('accept_code').addEventListener('click',function(e){
			let code = document.getElementById('promo');
			code = code.value.replace(/\s/g, '')
			let err_code = document.getElementById('err_code');
			if(code.length == 16){
				err_code.style.display = 'block';
				err_code.style.color = 'green';
				err_code.innerHTML = 'Промокод успешно активирован!';
				setTimeout(()=>{
					closePopup();
					OpenPOPuPPay(name, 5000, id)
				},1000)
			}else{
				err_code.style.display = 'block';
				err_code.style.color = 'red';
				err_code.innerHTML = 'Неверный код';
			}
		})
	}
}

function OpenPOPuPPay(name,cost,id){
	// sendTeacher(id);
	// return;
	if (cost <= 0) 
	{
		sendTeacher(id);
	} 
	else {
		let inId = generateTransaction();
		teacher = id;
		POST('/request', `method=CHECK-ID&&invoiceId=${inId}`, (res, status)=>{
			if(status === 200){
				if(res.isOk){
					var widget = new cp.CloudPayments();
				    widget.charge({ // options
				            publicId: 'pk_eaff98b9708d86599925646c1e73c',  //id из личного кабинета
				            description: name, //назначение
				            amount: cost, //сумма
				            currency: 'KZT', //валюта
				            invoiceId: inId, //номер заказа  (необязательно)
				        },
			        function (options) { // success
			            sendTeacher(id, inId);
			        },
			        function (reason, options) { // fail
			            //действие при неуспешной оплате
			        });
				}else{
					OpenPOPuPPay(name,cost,id)
				}
			}
		})
	}
}
function generateTransaction(){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 15; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}


//Функция конвертации во время сервера
function ConvertToServ(time, dif, day){
	s = Number(time.start) - dif;
	f = Number(time.finish) - dif;
	d = day;
	let mas = [];
	if(s >= 0){
		if(s >= 24){
			if(d != 6)
				d++;
			else d = 0;
			mas.push(s - 24, f - 24, d)
		}else{
			if(f > 24){
				mas.push(s, 24, d)
				if(d != 6)
					d++;
				else d = 0;
				mas.push(0, f - 24, d)
			}else{
				mas.push(s, f, d)	
			}
		}
	}else{
		if(f > 0){
			if(d != 0)
				d--;
			else d = 6;
			mas.push(s + 24, 24, d)
			if(d != 6)
				d++;
			else d = 0;
			mas.push(0, f, d)
		}else{
			if(d != 0)
				d--;
			else d = 6;
			mas.push(s + 24, f + 24, d)
		}	
	}
	return mas;
}

function UTCFunc(){
	let time = (new Date()).getHours() - (new Date()).getUTCHours();
	if(new Date().getFullYear() > new Date().getUTCFullYear())
		time += 24;
	else if(new Date().getFullYear() < new Date().getUTCFullYear())
		time -= 24;
	else if(new Date().getMonth() > new Date().getUTCMonth())
		time += 24;
	else if(new Date().getMonth() < new Date().getUTCMonth())
		time -= 24;
	else if(new Date().getDate() > new Date().getUTCDate())
		time += 24;
	else if(new Date().getDate() < new Date().getUTCDate())
		time -=24;
	return time;
}