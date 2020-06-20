let quickTeacherId = 0

function getCoursesPage()
{
	content.innerHTML = `<div class="CourseState" id="CourseState"></div>`;

	window.courses = content.querySelector('.CourseState');

	POST('/course', 'method=GETALL', (res, stat)=>
	{
		if (res.status == 200) 
		{
			let rateList = res.rateList;
			let userRate = res.userRate;
			let accept = res.accept;
 			
			for(let i = 0; i<rateList.length; i++)
			{
				addCourse(
				{
					rate_name: 		rateList[i].rate_name,
					rate_content: 	rateList[i].rate_content,
					rate_title: 	rateList[i].rate_title,
					group_type: 	rateList[i].group_type,
					unlim: 			rateList[i].unlim,
					lessons: 		rateList[i].lessons,
					rate_id: 		rateList[i].rate_id,
					rate_cost: 		rateList[i].rate_cost,
					sale: 			rateList[i].sale,
					oldCost: 		rateList[i].oldCost,
					userRate,
					accept
				}, 
				courses
				);
			} 
		} 
		else 
		{
			content.innerHTML = `<div class="nopeCourse">На данный момент отсутствуют доступные курсы</div>`;
		}
		let children = document.getElementsByClassName('CourseBlock');
		let blockWidth = 0;
		for (var i = 0; i < children.length; i++) {
			let style = window.getComputedStyle(children[i]);
			let marginLeft = style.getPropertyValue('margin-left'); 
			let marginRight = style.getPropertyValue('margin-right'); 
			blockWidth += Number(marginLeft.substring(0, marginLeft.length - 2));
			blockWidth += Number(marginRight.substring(0, marginRight.length - 2));
			blockWidth += children[i].clientWidth;
		}
		generateScroll('CourseState',content,{height: '100%', width: '100%'}, 1, 1, content.clientHeight / blockWidth);
	});
}


function addCourse(data, layout)
{
	let div = document.createElement('div');
	div.classList.add('CourseBlock');
	div.title = data.rate_content;
	div.style.background = coloring(data.rate_id);

	let application = `<button id = 'application_${data.rate_id}' class="PerehodCourse" title = 'Записаться'>Записаться</button>`;

	if (data.userRate == data.rate_id)
	{
		application = `<button id = 'delete_req' class="PerehodCourse" title = 'Вы отправили заявку на данный курс'>Удалить заявку</button>`;
	} 

	div.innerHTML =
	`
		<div class="CourseHead" id="CourseHeadRandColor">
			<div class="NameCourseCompany">${data.rate_name}</div>
		</div>

		<div class="CourseBody" id='${data.rate_id}'>
			<div class = 'owerflow'>
				<div class="TitleCourse">${data.rate_title}</div>
				<div class="LessonCourse">${getHours(data.lessons, data.unlim)}</div>
				<div class="TypeCouse">${getType(data.group_type)}</div>
				<div class="UnlimCourse">${getUnlim(data.unlim)}</div>
				<div class="prevCostCourse"><strike>${data.oldCost}kzt</strike></div>
				<div class="CostCourse">${data.rate_cost}kzt</div>
			</div>
			${application}
		</div>
	`;
	if (data.userRate == data.rate_id) 
	{
		var script = `<div class="haveCourse">
						<h2 class="haveCourse-h2">ВНИМАНИЕ!</h2>
						<h3 class="haveCourse-h3">В случае отмены заявки, возврат денежных средств не производится!</h3>
						<h3 class="haveCourse-h3">Вы уверены, что хотите удалить заявку?</h3>
						<div class="button-container">
							<div id='close' class="twoButton twoButton-delete">отмена</div>
							<div id='delete' class="twoButton twoButton-delete">да</div>
						</div>
					  </div>`;

		div.querySelector(`#delete_req`).addEventListener('click',function(e)
		{

			showPopup(script, { width: '26.5vw', height: '26.5vh', background: '#fff', top: '10vh'});
			document.getElementById('close').addEventListener('click',function(e){
				closePopup();
			})
			document.getElementById('delete').addEventListener('click',function(e){
				closePopup();
				POST('request', 'method=DELETE',function(res, stat){
					if(stat === 200){
						getCoursesPage();
						GetNotice('application', 'Заявка успешно удалена');
					}
				})
			})
			
		});
	} 
	else if(!data.accept)
	{
		if (data.userRate != null) 
		{
			div.querySelector(`#application_${data.rate_id}`).addEventListener('click',function(e)
			{
				GetNotice('application', 'У вас есть заявка') 
			})
		} 
		else 
		{
			div.querySelector(`#application_${data.rate_id}`).addEventListener('click',function(e)
			{
				GetNotice('application', 'Вы уже записаны');
			})
		}
		
		div.querySelector(`#application_${data.rate_id}`).classList.add('disabled');
	}
	else 
	{
		div.querySelector(`#application_${data.rate_id}`).addEventListener('click',function(e)
		{
			POST('/course', 'method=CHECK-LEVEL', function(req, res) {
				let date = new Date()
				let weekday = date.getDay();
				let hour 	= date.getHours();
				let minutes = date.getMinutes()

				POST('/request', 'method=NEAR', (res) => {
					console.log(res)
					quickTeacherId = res.teacherId
					date = new Date(res.date)
					let answer = {day: date.getDay(), time: date.getHours(), minutes: date.getMinutes()}
				
					if (!req.accept) getLevelTest()
					if(data.rate_id == 1)
						showPopup(`
						<div class="haveCourse">
							<h3>Вы можете записаться на ближайшее время, либо выбрать удобное для вас в любой день недели! 
							Ближайшее занятие: ${getWeekDay(answer.day)} c ${answer.time}:${answer.minutes==0?'00':'30'} до ${answer.time+1}:${answer.minutes==0?'00':'30'}</h3>
							<div class="button-container">
								<button onclick="nearTime(${answer.day}, ${answer.time}, ${answer.minutes})" class="twoButton twoButton-delete">Ближайшее время</button>
								<button onclick="setTime()" class="twoButton twoButton-delete">Выбрать самому</button>
							</div>
						</div>`, { width: '30vw', height: '30vh', top: '15vh', background: '#fff'});	
					else goto(`request/${data.rate_id}`)

				})
			})
		});
	}

	layout.appendChild(div);
	if(data.sale == 1){
		let bgimg = document.createElement('img');
		bgimg.classList.add('sale');
		bgimg.src = '/img/new_sale.png'
		document.getElementById(`${data.rate_id}`).appendChild(bgimg);
	}
}
function setTime(){
	goto('request/1');
	closePopup()
}
function nearTime(day, time, minutes){
	POST('/request', `method=QUICKLY&&teacher=`+quickTeacherId, (res, status)=>{
		if(status == 200) {
			GetNotice('application', `Заявка принята. Ваше занятие начнется в ${time}:${minutes==0?'00':'30'}`);
			getCoursesPage();
		}
		else GetNotice('application', 'В данный момент мы не можем принять вашу заявку! Попробуйте выбрать время самостоятельно!');
	})
	closePopup()
}
function getHours(les, u)
{
	if(u) return '';

	let h = les % 10;

	if(les > 20)
	{
		if(h == 0) return les + ' часов';
		else if(h == 1) return les + ' час';
		else if(h < 5) return les + ' часа';
		else return les + ' часов';
	}
	else if(les > 4) return les + ' часов';
	else 
	{
		if(les == 1) 		return '1 час';
		else if(les > 1) 	return les + ' часа';
	}
}

function getType(type)
{
	return type ? 'Индувидуально' : 'Групповые занятия';
}
function getUnlim(u)
{
	return u? 'Безлимит': '';
}


function coloring(i)
{
	// i = Math.floor(Math.random() * 11)
	let col = i % 10;

	switch (col) 
	{
	 	default: return '#FFEFD5';
	 } 
}

function getLevelTest() {
	POST('/test','method=GET-LEVEL',function(req,res){
		showPopup(`<div class="haveCourse">
					<h2>Упс!</h2>
					<h3>Мы не знаем уровень вашего английского. <br> Вам необходимо пройти тест, чтобы определить ваш уровень!</h3>
					<div class="button-container">
						<button id='close' class="twoButton twoButton-delete">отмена</button>
						<button id='start' class="twoButton twoButton-delete">начать</button>
					</div>
				  </div>`, { width: '30vw', height: '30vh', top: '15vh', background: '#fff'});

		document.querySelector(`#close`).addEventListener('click',function(e)
		{
			closePopup();
		})

		document.querySelector(`#start`).addEventListener('click',function(e)
		{
			showPopup(`<div class = 'testBlock'></div>`, { width: '65%', height: '90vh', top: '5vh', close: true, background: '#fff'});
			showPopUpTest(req.testList, 0);
		})
	})
}

function getNearTime(hour, weekday, minutes) {
	// if(minutes < 30) minutes = 30;
	// else{minutes = 0; hour++} 
 
	// while(true){
	// 	if(minutes == 60) {minutes = 0; hour++}
	// 	if(weekday > 5 || weekday == 0) {weekday = 1; hour = 9; minutes = 0}
	// 	if(hour >= 9){
	// 		if(hour < 20){
	// 			if(hour == 19 && minutes == 30){}
	// 			else break;
	// 		}else {hour = 9; weekday++;}	
	// 	}else {hour = 9; minutes = -30;}-
	// 	minutes += 30;
	// }
	let date = getNearDate()
	return {day: date.getDay(), time: date.getHours(), minutes: date.getMinutes()};
}
function getWeekDay(i) {
	switch(i) {
		case 0: return "Воскресенье"
		case 1: return "Понедельник"
		case 2: return "Вторник"
		case 3: return "Среда"
		case 4: return "Четверг"
		case 5: return "Пятница"
		case 6: return "Суббота"
	}
}

function getNearDate() {
	let date


	// while(date.getMinutes() != 30 && date.getMinutes() != 0) date = new Date(date.valueOf() + 1000*60);
	// while(DateIsOk(date)) date = new Date(date.valueOf() + 1000*60*30);
	console.log(date)
	return date;
}

function DateIsOk(date) {
	// Время работы препода в UTC
	let periods = [ 2,7,1,
		2,7,2,
		2,7,3,
		2,7,4,
		2,7,5
	]

	let mas = []

	for(let i = 0; i<periods.length; i+=3) 
		mas = mas.concat(periodsForUser(periods[i], periods[i+1], periods[i+2]))

	mas = concatPeriods(mas)

	let ok = true
	for(let i = 0; i<mas.length; i += 3) {
		if(date.getDay() == mas[i+2] && date.getHours() >= mas[i] && date.getHours() <= mas[i+1])
			ok = false
	}

	return ok
}

// Объединение промежутков [0,16,1,16,24,1] -> [0,24,1]
	function concatPeriods(mas) {
		let result = []
		for(let day = 0; day < 7; day++) {
			let forDay = []

			for(let i = 2; i<mas.length; i+=3) {
				if(mas[i] == day) {
					forDay.push(mas[i-2])
					forDay.push(mas[i-1])
					forDay.push(mas[i])
				}
			}

			//тут график на день [1, 8, 1, 8, 20, 1, 20, 21, 1] -> [1,20,1] для наглядности
			let buffer = forDay
			// console.log('forday: ', forDay)
			for(let i = 0; i<forDay.length; i+=3) {
				for(let j = 1; j<forDay.length; j+=3) {
					if(forDay[i] == forDay[j]) {
						let founded = [forDay[j-1], forDay[i+1], day]
						delete forDay[j-1]
						delete forDay[j]
						delete forDay[j+1]
						delete forDay[i]
						delete forDay[i+1]
						delete forDay[i+2]
						buffer = []
						for(let l = 0; l<forDay.length; l++) 
							if(forDay[l]) buffer.push(forDay[l])
						buffer = buffer.concat(founded)
					}
					forDay = buffer
					// console.log(forDay)
				}
			}
			if(forDay.length) result = result.concat(forDay)
		}
		return result
	}

// Перевод промежутков во время клиента
	function periodsForUser(start, finish, day) {
		if(day > 6 || day < 0) return console.log('day: ', day)
		let date = new Date()
		while(true) {
			if(date.getUTCDay() == day) break
			else date = new Date(date.valueOf() + 1000*60*60*24)
		}

		let startDate = new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(), start, 0, 0))
		let finishDate = new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(), finish, 0, 0))
	 
		let resultStart 	= startDate.getHours()
		let resultFinish 	= finishDate.getHours()
		let startDay 		= startDate.getDay()
		let finishDay	 	= finishDate.getDay()

		if(finishDay == startDay) return [resultStart, resultFinish, startDay]
		else if(resultFinish != 0) return [resultStart, 24, startDay, 0, resultFinish, finishDay]
		else return  [resultStart, 24, startDay]
	}