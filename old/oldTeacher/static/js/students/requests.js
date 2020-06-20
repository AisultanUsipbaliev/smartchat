//Глобальные переменные
	let current_student_id = 0;
	let current_group_type = 0;
	let current_student_name = '';
	let unlim = 0;
	let reqs = document.getElementById('reqs');
	let ones = document.getElementById('ones');
	let graph = document.getElementById('graph');
	let firstday = document.getElementById('firstday');
	let lessons = 0;
// Функция принимает ответ после добавления в новую группу
	function getResponse(req)
	{
		if(req.status == 200)
		{
			notifier('Заявка успешно обработана!\nСтудент добавлен. Ваше расписание изменилось.', 'green');
			document.querySelector('.back').style.display = 'none';
			document.getElementById('new_group').style.display = 'none';
			deleteReq(current_student_id);
			document.querySelector('.background').style.display = 'none';
		}
		else if(req.status == 202)
		{
			let res = JSON.parse(req.response);
			switch(res.code)
			{
				case 1:
					let UTCdifference = UTCFunc();
					let responce = {start_time: Number(res.start), finish_time: Number(res.finish), nday: Number(res.day)}
					responce = ConvertToView(responce,UTCdifference)
					res = responce[1] || responce[0];
					notifier(getDayName(Number(res.nday)) + ': время '+res.start_time+':00 - '+ res.finish_time + ':00'+' не входит в ваш график работы!', 'red');
				break;
				case 2:
				let date = new Date(res.today);
				let m = date.getMonth() + 1;
				notifier(date.getDate() + '.' + m + '.' + date.getFullYear() + ': у вас и так много групп!', 'red');
				break;
				case 3:
				notifier(res.message, 'red');
				break;
				case 4:
				notifier(res.message, 'red');
				break;
				case 5:
				notifier(res.message, 'red');
				firstday.style.background = 'linen';
				break;
				case 100:
				notifier(res.message, 'red');
				break;
				default:
				notifier('Не опознал код ответа!', 'red');
				break;
			}
			document.querySelector('.background').style.display = 'none';
		}
		else
		{
			notifier('Статус ответа плох!', 'blue');
		}
	}

// Добавляем студента в новую группу
	document.getElementById('create_btn').addEventListener('click', function()
		{
			let gr_name = document.getElementById('new_group_name').value;
			let firstday = document.getElementById('firstday');

			if(gr_name.length == 0)
			{
				notifier('Введите название группы!', 'red');
				document.getElementById('new_group_name').style.background = 'linen';
				return;
			}
			else
			{
				document.getElementById('new_group_name').style.background = 'white';
			}

			let gr_type;
			let selects = document.getElementsByClassName('jm_select');
			let mas = [];
			let student_id = document.getElementById('accept').getAttribute('stid');

			if(document.getElementById('new_group_name').disabled == true)
			{
				gr_type = 1;
				if(!firstday.value)
				{
					firstday.style.background = 'linen';
					notifier('Введите день начала занятий!', 'red');
					return;
				}
				else
				{
					firstday.style.background = 'white';
				}
			}
			else
			{
				gr_type = 0;
			}

			for(let i = 0; i < selects.length; i = i+2)
			{
				let nday 		= selects[i].getAttribute('nday');
				let start_time 	= selects[i].value;
				let finish_time = selects[i+1].value;
				
				if(start_time != 'нет') 
				{
					mas.push({start_time, finish_time, nday});
				}

			}
			let UTCdifference = UTCFunc();

			for (let i = 0; i < mas.length; i++) 
				mas[i] = Convert(mas[i], UTCdifference);

			let servmas = '';
			for (let i = 0; i < mas.length; i++){
					servmas += mas[i];
					if(i != mas.length - 1)
					servmas += ',';
			}
			mas = servmas;
			if(mas.length == 0)
			{
				notifier('Назначьте время!', 'red');
				document.getElementById('grafik').style.background = 'linen';
				return;
			}
			else
			{
				document.getElementById('grafik').style.background = 'white';
			}

			if(mas.length < (lessons/4) * 3)
			{
				notifier('Недостаточно слотов времени! Вы не можете принять заявку!', 'red');
				document.getElementById('grafik').style.background = 'linen';
				return;
			}
			else
			{
				document.getElementById('grafik').style.background = 'white';
			}
			// if(firstDayN != mas[2 + (3 * firstI)])
			// 	if(firstDayN < mas[2 + (3 * firstI)])
			// 		firstDayN = new Date(new Date(firstday.value).setDate(new Date(firstday.value).getUTCDate() + 1)).valueOf();
			// 	else firstDayN = new Date(new Date(firstday.value).setDate(new Date(firstday.value).getUTCDate() - 1)).valueOf();
			// else
			//  firstDayN = new Date(firstday.value).valueOf();
			let firstDayN = new Date(new Date(firstday.value).setDate(new Date(firstday.value).getUTCDate())).valueOf();
			let params = 'method=TAKE-ON'+
						'&&student_id=' + student_id +
						'&&group_name=' + gr_name + 
						'&&mas=' + mas + 
						'&&group_type=' + gr_type +
						'&&day=' + firstDayN;

			validateAct('Вы уверены что хотите создать такой график?', '/req', params, getResponse);
		});

// Функция подтверждения действия
	function validateAct(text, route, params, funct)
	{
		document.getElementById('validator').innerHTML =
			'<h2 id ="validation"></h2>'+
			'<button id = "validation_escape" class="button cancel">Отмена</button>'+
			'<button id = "validation_ok" class="button accept">Принять</button>';

		document.querySelector('.background').style.display = 'block';
		document.getElementById('validation').innerHTML = text;

		document.getElementById('validation_escape').addEventListener('click', ()=>
		{
			document.querySelector('.background').style.display = 'none';
		});

		document.getElementById('validation_ok').addEventListener('click', ()=>
		{
			POST(route, params, funct);
		});
	}

// Функция отклоняет заявку
	function rejectReq(e) 
	{
		validateAct('Вы действительно хотите отклонить заявку?', '/req', 'method=REJECT&&student_id=' + current_student_id, rejected);
	}

// Функция принимает ответ при удалении заявки
	function rejected(req) 
	{
		if(req.status == 200)
		{
			deleteReq(current_student_id);
			notifier('Заявка удалена!', 'green');
			document.querySelector('.background').style.display = 'none';
		}
		else
		{
			console.log(req.response);
		}
	}

// Функция удаляет заявку по id студента
	function deleteReq(id)
	{
		let li = reqs.children;
		for(let i = 0; i<li.length; i++)
		{
			if(li[i].id.split('=')[1] == id)
			{
				reqs.removeChild(li[i]);
				if(current_student_id == id)
				{
					graph.style.display = 'none';
					document.querySelector('.back').style.display = 'none';
					document.getElementById('new_group').style.display = 'none';
				}
			}
		}

		let lit = ones.children;
		for(let i = 0; i<lit.length; i++)
		{
			if(lit[i].id.split('=')[1] == id)
			{
				ones.removeChild(lit[i]);
				if(current_student_id == id)
				{
					graph.style.display = 'none';
					document.querySelector('.back').style.display = 'none';
					document.getElementById('new_group').style.display = 'none';
				}
			}
		}
	}

/*Добавление студента в группу*/
 document.getElementById('accept_btn').addEventListener('click', function()
	{
		let checkboxes = document.getElementById('groups').getElementsByClassName('chb');
		let group_id;
		for(let i = 0; i< checkboxes.length; i++)
		{
			if(checkboxes[i].checked)
			{
				group_id = checkboxes[i].id.split('=')[1];
			}
		}
		
		if(!group_id)
		{
			notifier('Выберите группу!', 'red');
			return;
		}

		POST('/req', 'method=TAKE-IN&&' + 'group_id=' + group_id + '&&student_id=' + current_student_id , (req) =>
			{
				if(req.status == 200)
				{
					notifier('Заявка успешно обработана!\nСтудент добавлен. Ваше расписание изменилось.', 'green');

					document.querySelector('.back').style.display = 'none';
					document.getElementById('new_group').style.display = 'none';
					document.getElementById('graph').style.display = 'none';

					document.getElementById('reqs').removeChild(document.getElementById('li='+current_student_id));
				}
				else
				{
					let res = JSON.parse(req.response);
					notifier(res.message, 'red');
				}
			});
	});

/*Открываем окно добавления группы и переносим график*/
	document.getElementById('new_group_btn').addEventListener('click',function()
	{
		document.getElementById('new_group_name_title').innerHTML = 'Название группы';
		document.getElementById('new_group_name_title').style.display = 'block';
		document.getElementById('new_group_title').innerHTML = 'Новая группа';
		document.getElementById('new_group').style.display = 'block';
		document.getElementById('new_group_name').value = '';
		document.getElementById('new_group_name').disabled = false;

		if(current_group_type == 0)	document.getElementById('firstday').style.display = 'none';
		else document.getElementById('firstday').style.display = 'block';
		
		generateGraph();
	});

/*Доставка нужных групп либо создание индивидуальной*/
	document.getElementById('accept').addEventListener('click', function(e)
	{
		if(current_group_type == 0)
		{
			document.querySelector('.back').style.display = 'block';

			let div = document.getElementById('cont');
			div.innerHTML = '';
			
			POST('/req', 'method=GET-GROUPS&&student_id='+current_student_id, (requ)=>
				{
					let res = JSON.parse(requ.response);
					let mas = res.mas;
					if(requ.status == 200)
					{
						for(let i = 0; i < mas.length; i++)
						{
							let chb = document.createElement('input');
							let label = document.createElement('label');
							chb.type = 'radio';
							chb.name = 'group';
							chb.id = 'b='+ mas[i].group_id;
							chb.classList.add('chb');
							chb.style.display = 'none';
							label.style.display = 'inline-block'
							label.classList.add('lbl')
							label.innerHTML = '<label for="b='+mas[i].group_id+'">'+mas[i].group_name+' ('+mas[i].kol+')'+'</label>';

							div.appendChild(chb);
							div.appendChild(label);
						}
						if(mas.length == 0)
						{
							notifier('Подходящих групп не найдено!', 'blue');
							div.innerHTML = 'не найдено!';
							document.getElementById('groups').style.display = 'none';
							document.getElementById('new_group_btn').click();
						}
						else
						{
							document.getElementById('groups').style.display = 'block';
						}
					}
				});
		}
		else
		{
			document.getElementById('new_group_title').innerHTML = 'График для студента';
			document.getElementById('new_group_name_title').style.display = 'none';
			document.getElementById('new_group_name').value = current_student_name;
			document.getElementById('new_group_name').disabled = true;

			document.querySelector('.back').style.display = 'block';
			document.getElementById('new_group').style.display = 'block';
			document.getElementById('firstday').style.display = 'block';
			generateGraph();
		}
		
	});

// Функция генерирует график с выборками времени
	function generateGraph()
	{
		let table = document.getElementById('grafik');
		table.innerHTML = '';

		let chld = document.getElementById('tbl').children;

		for(let i = 0; i<chld.length; i++)
		{
			let tr = document.createElement('tr');
			let td1 = document.createElement('td');
			let td2 = document.createElement('td');
			let td3 = document.createElement('td');
			///////////////////////td 1
			td1.innerHTML = '<span class="day_in_line">'+chld[i].children[0].innerHTML+'</span>';
			
			///////////////////////td2
			let select = document.createElement('select');

			select.setAttribute('nday', chld[i].getAttribute('nday'));
			let option = document.createElement('option');
			option.innerHTML = 'нет';
			select.appendChild(option);
			select.classList.add('jm_select');
			let start = Number(chld[i].children[1].innerHTML.split(':')[0]);
			let finish = Number(chld[i].children[2].innerHTML.split(':')[0]);

			for(let i = start; i < finish; i++)
			{
				let option = document.createElement('option');
				option.value = i;
				option.innerHTML = i + ':00'
				select.appendChild(option); 
			}			
			if(unlim)
			{
				select.value = start;
				select.disabled = true;
			}

			///////////////////////td3
			let sel = document.createElement('select');
			let opt = document.createElement('option');
			opt.innerHTML = 'нет';
			sel.appendChild(opt);
			sel.classList.add('jm_select');

			for(let i = start+1; i <= finish; i++)
			{
				let opt = document.createElement('option');
				opt.value = i;
				opt.innerHTML = i + ':00'
				sel.appendChild(opt); 
			}
			if(unlim)
			{
				sel.value = finish;
				sel.disabled = true;
			}
			if(unlim == 0)
			{
				select.addEventListener('change', function()
				{
					if(select.value != 'нет')
					sel.value = Number(select.value)+1;
					else sel.value = 'нет';
				});
				sel.addEventListener('change', function()
					{
						if(sel.value != 'нет')
						select.value = Number(sel.value)-1;
						else select.value = 'нет';
					});
			}

			td2.appendChild(select);
			td3.appendChild(sel);

			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			table.appendChild(tr);
		}
	}

// Функция возвращает день недели по номеру
	function getDayName(i)
	{
		switch(i)
		{
			case 0: return 'Воскресенье';
			case 1: return 'Понедельник';
			case 2: return 'Вторник';
			case 3: return 'Среда';
			case 4: return 'Четверг';
			case 5: return 'Пятница';
			case 6: return 'Суббота';
			default: return 'День сурка';
		}
	}

// Функция добавляет заявку в указанный список(нижний или верхний)
	function setReq(ul, body)
	{
		// Элемент списка 
		let li = document.createElement('li');
		li.id = 'li=' + body.student_id;

		// Radiobutton
		let chb = document.createElement('input');
		chb.id = 'chb=' + body.student_id;
		chb.type = 'radio'; 
		chb.name = 'req';
		chb.classList.add('chb');
		chb.style.display = 'none';
		chb.setAttribute('student_name', body.lastname + ' ' + body.firstname);

		// Label внешний
		let lbl = document.createElement('label');
		lbl.classList.add('student_name');
		lbl.setAttribute('type', 'lbl='+ body.student_id);

		// Дата заявки
		let date = new Date(body.req_dt);
		let mounth = date.getMonth() +1;
		let dt = date.getHours() + ":"+date.getMinutes() + ' ' +  date.getDate() + '.'+mounth+'.'+date.getFullYear();
		
		// Имя студента
		let name = body.lastname + ' ' + body.firstname;

		// Записываем ися студента и его уровень во внутренний label.
		lbl.innerHTML = "<label for = 'chb="+ body.student_id+"'><p>"+
		name+ '</p><a>' + body.lvl_name + '</a></label>';

		// Событие при выборе заявки
		chb.addEventListener('change',getStudentReq);

		// Дата заявки
		let a = document.createElement('a');
		a.classList.add('a_date');
		a.innerHTML = dt;

		li.appendChild(chb);
		li.appendChild(lbl);
		li.appendChild(a);
		ul.appendChild(li);
	}

// Функция выводит заявку студента
	function getStudentReq(e) 
	{
		document.getElementById('graph').style.display = 'inline-block';
		let id = e.target.id.split('=')[1];

		document.getElementById('accept').setAttribute('stid', id);
		POST('/req', 'method=GET-GRAPH&&student_id='+id, (req)=>
			{
				if(req.status == 200)
				{
					let res = JSON.parse(req.response);
					let body = res.body;
					lessons = body[0].lessons;
					current_group_type = body[0].group_type;
					current_student_id = id;
					unlim = body[0].unlim;
					current_student_name = e.target.getAttribute('student_name');
					document.getElementById('rate_name').innerHTML = body[0].rate_name;
					document.getElementById('rate_name').title = body[0].rate_title;

					let table = document.getElementById('tbl');
					table.innerHTML = '';
					let UTCdifference = UTCFunc();
					for (let i = 0; i < body.length; i++) 
							body[i] = ConvertToView(body[i], UTCdifference);
					let mas = [];
					for (let i = 0; i < body.length; i++)
					for (let q = 0; q < body[i].length; q++)
						mas.push(body[i][q])
					 body = mas;

					 for (let i = 0; i < body.length; i++) 
						for (let j = 0; j < i; j++) {
							// if(body[i].nday)
							if(body[i].nday === body[j].nday){
								console.log('popal')
								if(body[i].start_time === body[j].finish_time){
									body[i].start_time = body[j].start_time;
									body.splice(j, 1)
									i--;
								}
							}
						}

					body.sort(function(a,b){
						if (a.nday > b.nday)
							return 1
						else if (a.nday < b.nday)
							return -1
						else return 0
					})
					
					for(let i = 0; i < body.length; i++)
					{
						let tr = document.createElement('tr');
						tr.setAttribute('nday', body[i].nday);
						let td1 = document.createElement('td');
						let td2 = document.createElement('td');
						let td3 = document.createElement('td');
						td1.classList.add('td1');
						td1.innerHTML = getDayName(body[i].nday);
						td1.setAttribute('nday', body[i].nday);
						td2.innerHTML = body[i].start_time + ':00';
						td2.setAttribute('nday', body[i].nday);
						td3.innerHTML = body[i].finish_time + ':00';
						td3.setAttribute('nday', body[i].nday);
						tr.appendChild(td1);tr.appendChild(td2);tr.appendChild(td3);
						table.appendChild(tr);
					}
					
				}
				else
				{
					console.log(req.response);
				}
			});
	}

// Функция выводит все заявки
	function getReqs()
	{
		POST('/req', 'method=GET', (req) =>
		{
			if(req.status == 200)
			{
				let res = JSON.parse(req.response);
				let body = res.body;
				
				for(let i = 0; i<body.length; i++)
				{
					if(body[i].lessons > 1)
					{
						setReq(reqs, body[i]);
					}
					else
					{
						setReq(ones, body[i]);
					}
				}
				generateScroll("ones", document.getElementsByClassName('container')[0], {height: 'calc(100% - 11vh)', width: '100%'}, 1, 1)
			}
			else
			{
				notifier('Новых заявок нет!', 'green');
			}
		});
	}

// Скрипт
	getReqs();

// Обработчик закрытия окна добавления группы
	document.getElementById('cancel_new').addEventListener('click',function()
		{
			if(!document.getElementById('new_group_name').disabled)
			{
				document.getElementById('new_group').style.display = 'none';
				if(document.getElementById('groups').style.display == 'none')
					document.querySelector('.back').style.display = 'none';
			}
			else
			{
				document.getElementById('new_group').style.display = 'none';
				document.querySelector('.back').style.display = 'none';
			}
		});

// Обработчик закрытия окна
	document.getElementById('cancel').addEventListener('click', function()
		{
			document.querySelector('.back').style.display = 'none';
		});

//Функция конвертации во время сервера
function Convert(time, dif){
	s = Number(time.start_time) - dif;
	f = Number(time.finish_time) - dif;
	d = Number(time.nday);
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

//Функция конвертирует время для пользователся
function ConvertToView(time, dif){
	s = time.start_time + dif;
	f = time.finish_time + dif;
	d = time.nday;
	let mas = [];
	if(s >= 0){
		if(s >= 24){
			if(d != 6)
				d++;
			else d = 0;
			mas.push({start_time:s - 24, finish_time: f - 24, nday: d})
		}else{
			if(f > 24){
				mas.push({start_time:s, finish_time: 24, nday: d})
				if(d != 6)
					d++;
				else d = 0;
				mas.push({start_time:0, finish_time: f - 24, nday: d})
			}else{
				mas.push({start_time:s, finish_time: f, nday: d})	
			}
		}
	}else{
		if(f > 0){
			if(d != 0)
				d--;
			else d = 6;
			mas.push({start_time:s + 24, finish_time: 24, nday: d})
			if(d != 6)
				d++;
			else d = 0;
			mas.push({start_time:0, finish_time: f, nday: d})
		}else{
			if(d != 0)
				d--;
			else d = 6;
			mas.push({start_time:s + 24, finish_time: f + 24, nday: d})
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




// function Convert(time, dif){
// 	time.nday = Number(time.nday);
// 	time.start = Number(time.start)
// 	time.finish = Number(time.finish)
// 	console.log(time.start)
// 	let mas = [];
// 	if(time.start - dif < 0){
// 		if(time.finish - dif > 0){
// 			mas.push(24 + (time.start - dif));
// 			mas.push(24);
// 			if(time.ntime.nday != 0)
// 				mas.push(time.nday - 1);
// 			else mas.push(6);
// 			mas.push(0);
// 			mas.push(time.finish - dif);
// 			mas.push(time.nday);
// 		}else if(time.finish - dif < 0){			
// 			mas.push(24 + (time.start - dif));
// 			mas.push(24);
// 			if(time.nday != 0)
// 				mas.push(time.nday - 1);
// 			else mas.push(6);
// 			mas.push(0);
// 			mas.push(24 + (time.finish - dif));
			
// 			if(time.nday != 0)
// 				mas.push(time.nday - 1);
// 			else mas.push(6);
// 		}
// 		else{
// 			mas.push(24 + (time.start - dif));
// 			mas.push(24);
// 			if(time.nday != 0)
// 				mas.push(time.nday - 1);
// 			else mas.push(6);
// 		}
// 	}else{
// 		if(time.start - dif < 24){
// 			mas.push(time.start - dif);
// 			if(time.finish - dif > 24){
// 				mas.push(24);
// 				mas.push(time.nday);
// 				mas.push(0);
// 				mas.push(time.finish - dif - 24);
// 				if(time.nday != 6)
// 					mas.push(time.nday + 1);
// 				else mas.push(0);
// 			}else{
// 				mas.push(time.finish - dif);
// 				mas.push(time.nday);
// 			}
// 		}else{
// 			mas.push(time.start - dif - 24);
// 			if(time.finish - dif > 24){
// 				mas.push(time.finish - dif - 24);
// 				if(time.nday != 6)
// 					mas.push(time.nday + 1);
// 				else mas.push(0);
// 			}
// 		}
// 	}
// 	console.log(mas)
// 	return mas;
// }


// function ConvertToView(time, dif){
// 	time.nday = Number(time.nday)
// 	time.start_time = Number(time.start_time)
// 	time.finish_time = Number(time.finish_time)
// 	let mas = [];
// 	if(time.start_time + dif < 24){
// 		time.start_time += dif;
// 		time.finish_time += dif;
// 		if(time.start_time < 0){
// 			time.start_time += 24;
// 			if(time.finish_time < 0){
// 				time.finish_time += 24;
// 				if(time.nday != 0)
// 					time.nday--;
// 				else time.nday = 6;
// 				mas.push({start_time: time.start_time, finish_time: time.finish_time, nday: time.nday});
// 			}else{
// 				mas.push({start_time:0, finish_time: time.finish_time, nday: time.nday});
// 				if(time.nday != 0)
// 					time.nday--;
// 				else time.nday = 6;
// 				mas.push({start_time:time.start_time, finish_time: 24, nday: time.nday});
// 			}
// 		}else{
// 			if (time.finish_time > 24){
// 				time.finish_time -= 24;
// 				mas.push({start_time:time.start_time, finish_time: 24, nday: time.nday});
// 				if(time.nday != 6)
// 					time.nday++;
// 				else time.nday = 0;
// 				mas.push({start_time:0, finish_time: time.finish_time, nday: time.nday});
// 			}else
// 			mas.push({start_time:time.start_time, finish_time: time.finish_time, nday: time.nday});
// 		}
// 	}else{
// 		time.start_time = time.start_time + dif;
// 		if (time.start_time >= 24)
// 			time.start_time -= 24;
// 		if (time.finish_time <= 0){
// 			time.finish_time = 0;
// 		}else{
// 			time.finish_time += dif;
// 			if (time.finish_time > 24)
// 				time.finish_time -= 24;
// 		}
// 		if(time.nday != 6)
// 			time.nday++;
// 		else time.nday = 0;
// 		mas.push({start_time:time.start_time, finish_time: time.finish_time, nday: time.nday});
// 	}
// 	return mas;
// }
