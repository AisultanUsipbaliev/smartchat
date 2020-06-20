// Глобальные
	let trs = document.querySelector('.table_grafik').children[0].children;
	let selects = document.getElementsByClassName('jm_select');
	// Генерация чисел
	for(let i =0 ;i<selects.length; i++) {
		for(let j =0; j<25; j++) {
			let option = document.createElement('option');
			option.innerHTML = j +':00';
			option.value = j;
			selects[i].appendChild(option);
		}
	}

// Достаем график
	POST('/graph','method=GET', function (req) {
		if(req.status == 200) {
			let res = JSON.parse(req.response);
			let body = res.body;

			let mas = [];
			for(let i = 0; i<body.length; i++) {
				mas = mas.concat(periodsForUser(body[i].start_time, body[i].finish_time, body[i].nday))
				// console.log('server: ', [body[i].start_time, body[i].finish_time, body[i].nday])
				// console.log('perevod: ', periodsForUser(body[i].start_time, body[i].finish_time, body[i].nday))
			}

			// console.log('itog: ', mas)
			mas = concatPeriods(mas);
			// console.log('soedinili: ', mas)
		
			for(let i = 0; i < mas.length; i+=3) {
				let index = mas[i+2] - 1
				if(mas[i+2] == 0) index = 6
				let tr = trs[index]
				let sel = tr.getElementsByClassName('jm_select')
				sel[0].value = mas[i]
				sel[1].value = mas[i+1]
			}
		}
	})

// Сохраняем график
	function saveGraph() {
		let taken = checkGraph()

		let servmas = [];
		for (let i = 0; i < taken.length; i++)
			servmas = servmas.concat(periodsForServer(taken[i].start, taken[i].finish, taken[i].day))
		
		servmas = concatPeriods(servmas)

		if(servmas.length > 0) POST('/graph', 'method=POST&&mas=' + servmas, 
			(req)=> {
				if(req.status == 200)  notifier('График успешно сохранен!', 'green');
				else if(req.status == 202) {
					let res = JSON.parse(req.response);
					notifier('У вас запланированное занятие: '+getDayName(res.day) + ' c '+res.start + ':00 до '+res.finish + ':00', 'red');
					let z = res.day-1;
					if(res.day == 0) z = 6;
					trs[z].style.background = 'linen';
				}
			}
		)
	}

// Собираем урожай
	function checkGraph() {
		let mas = [];

		for(let i = 0; i< trs.length; i++) {
			let sel = trs[i].getElementsByClassName('jm_select');
			trs[i].style.background = 'white';
			if((sel[0].value == 'нет' && sel[1].value != 'нет') || (sel[0].value != 'нет' && sel[1].value == 'нет')) {
				notifier('Некорректное время', 'red');
				trs[i].style.background = 'linen';
				return [];
			}

			if(sel[0].value != 'нет' && sel[1].value != 'нет') {
				let start = sel[0].value;
				let finish = sel[1].value;

				if(Number(start) >= Number(finish)) {
					notifier('Некорректное время', 'red');
					trs[i].style.background = 'linen';
					return [];
				}
				let day = i+1;
				if(day == 7) day = 0;
				mas.push({start, finish, day});
			}
		}
		return mas;
	}

// Конец