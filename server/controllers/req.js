let model = require('../models/req');
let config = require('../config');
// let sendMessage = require('../modules/botMessage');

function cross(s1, f1, s2, f2)
{
	if(s1 >= f2 || s2 >= f1 ) return false;
	else return true;
}

exports.Reject = async function(data, index, sessionName)
{
	try 
	{
		if(!index || !data.student_id) throw new Error('no index or student_id');

		let deleted = await model.DeleteReqS({student_id: data.student_id, index});

		if(deleted[0].affectedRows > 0)
		{
			
			let chat = await Chat({student_id: data.student_id});

			let chat_id = chat[0][0].chat_id;
			sendMessage({
							notice: 3, 
							chat_id, 
							text: 'Преподаватель ' + sessionName + ' отклонил вашу заявку! Подайте новую заявку /request другому преподавателю.'
						});

			return {status: 200, message: 'success'};
		}
		else
		{
			return {status: 202, message: 'not found'};
		}

	}
	catch (err)
	{
		return {status: 418, message: err}
	}
}
exports.TakeON = async function(data, index, sessionName)
{
	try 
	{
		if(!data.group_name || !data.mas || !data.group_type || !data.student_id) throw new Error('no group_name or group_type or student_id or mas');

		if (data.group_type == 1 && !data.day) 
		{
			return {status: 418, message: 'no firstday'};
		}
		else
		{
			let mas 		= data.mas.split(',');
			let group_name 	= data.group_name;
			let group_type 	= data.group_type;
			let student_id 	= data.student_id; 
			let day 		= data.day;
			let rate_id     = 0;
			let lessons 	= 0;
			let date;

			//Будем искать логическую ошибку и пытаться испортить этот флаг fl
			let fl = true;
			//Сначала проверяем наш график работы
			let graph = await model.Graph({index});

			//Каждую присланную дату будем проверять на совпадение с нашим графиком
			for(let j = 0; j < mas.length; j = j+3)
			{
				//зануляем флаг
				let flag = false;
				//Пробегаем по нашему графику
				for(let i = 0; i < graph.length; i++)
				{	
					//Когда нашли подходящую запись, которая удовлетворяет присланной дате
					if(graph[i].nday == mas[j] && mas[j+1] >= graph[i].start_time && mas[j+2] <= graph[i].finish_time)
					{
						//Флаг становится хорошим
						flag = true;
					} 
				}

				//Если не нашлась подходящая запись (мы явно не работаем в это время)
				if(!flag)
				{
					//Флаг, который все время ждет ошибку становится плохим
					fl = false;
					//возвращаем день недели в которой произошла накладка
					return {status: 202, code: 1,day:  mas[j], start: mas[j+1], finish: mas[j+2]}
				}
			}

			//Если флаг еще нормальный/ Ошибку еще не встретили
			if(fl)
			{
				let [rate_info] = await model.RateInfo({student_id: student_id});

				rate_id = rate_info.rate_id;
				lessons = rate_info.lessons;

				let dayIsOk = false;

				if(group_type == 1)
				{
					date = new Date(day);

					for(let i=0; i<mas.length; i=i+3)
					{
						if(date.getDay() == mas[i])
						{
							dayIsOk = true;
						}
					}

					let now = new Date();

					if(date < now)
					{
						dayIsOk = false;
					}
				}
				else
				{
					dayIsOk = true;
				}

				if(!dayIsOk)
				{
					fl = false;
					return {status: 202, code: 5,message: 'Неправильная дата первого занятия!'};
				}
				else
				{
					if(group_type == 1)
					{
						let allcheked = false;
						let count = 0;
						while(!allcheked)
						{
							let m = date.getMonth()+1;
							let today = date.getFullYear() + '-' + m + '-' + date.getDate();

							let [dailychart,l] = await model.DailyChart({index, today: today});
							let ms = [];

							for(let i = 0; i<mas.length; i=i+3)
							{
								if(date.getDay() == mas[i])
								{
									ms.push(mas[i+1]);
									ms.push(mas[i+2]);
								}
							}
							for(let j = 0; j<ms.length; j= j+2)
							{
								let kol = 0;
								for(let i = 0; i<dailychart.length; i++)
								{
									if(cross(ms[j], ms[j+1], dailychart[i].start_time, dailychart[i].finish_time))
									{
										kol++;
									}
								}

								if(kol >= config.groups)
								{
									fl = false;
									return {status: 202, code: 2, today}
								}
								else
								{
									count ++;
								}
							}

							if(!fl) break;
							if(count == lessons) break;
							date = new Date(date.valueOf() + 1000*60*60*24);
						} 
					}
				}
			}

			//Если до этого момента флаг остался хорошим, то данные прошли почти все проверки и можно записывать студента в группу и тд.
			if(fl)
			{	
				//Проверим есть ли такая группа, чтобы их названия не повторялись, иначе запутаемся
				let select = await model.SelectGr({group_name});
				if(select[0].length > 0)
				{
					//Повторили название группы, тогда отправим ошибку с кодом 3, чтобы исправляли
					return {status: 202, code: 3,message: 'Не повторяйте названия групп! У вас уже такая есть!'};
				}
				else
				{
					let ins = await model.CreateGr({group_name, index, group_type, rate_id});

					//Если получилось, то все ок
					if(ins[0].affectedRows > 0)
					{

						let group_id = ins[0].insertId;

						//Даем студенту эту группу
						let update_student = await model.UpdateStudent({group_id, student_id});

						if(group_type == 1)
						{
							//Теперь составим расписание для этой группы
							let enough = false;
							let today = new Date(data.day);
							let count = 0;

							while(!enough)
							{
								let m = today.getMonth() + 1;
								let day = today.getFullYear() + '-' + m + '-' + today.getDate(); 

								let ms = [];

								for(let i = 0; i<mas.length; i=i+3)
								{
									if(today.getDay() == mas[i])
									{
										ms.push(mas[i]);
										ms.push(mas[i+1]);
										ms.push(mas[i+2]);
									}
								}

								for(let i = 0; i<ms.length; i=i+3)
								{
									let insert = await model.CreateChart({group_id, day, ms1: ms[i+1], ms2: ms[i+2], count: count+1});
									
									count ++;
									if(count == lessons) 
									{
										enough = true;
										break;
									}
								}
								if(enough) break;
								today = new Date(today.valueOf() + 1000*60*60*24);
							}
						}
						else
						{
							for(let i = 0; i<mas.length; i=i+3)
							{
								await model.CreateGroupReq({group_id, mas1: mas[i+1], mas2: mas[i+2], mas: mas[i], index});
							}
						} 
		
						let deleted = await model.DeleteReq({student_id});

						let chat_id = await model.ChatId({student_id});

						chat_id = chat_id[0][0].chat_id;

						return {status: 200, message: 'Успешно обработана заявка'};

						if(group_type == 1)
						{
							sendMessage({notice: 2, chat_id, group_id, text: 'Преподаватель '+ sessionName +' добавил вас!'});
						}
						else
						{
							sendMessage({
											notice: 2, 
											chat_id, group_id, 
											text: 'Преподаватель '+ sessionName +' добавил вас в группу "'+ group_name +'"! Совсем скоро мы составим ваше расписание!'
										});
						}

						if(group_type == 1)
						{
							sendMessage({notice: 6, group_id });
						}
					}
					else
					{
						//Сюда код может привести только в самых крайних случаях
						console.log('Непредвиденные проблемы с записью новой группы в методе TAKE-ON роут /req! Записывает '+ sessionName + ' с id '+ index);
						//Отправим ошибку с кодом 4 / это уже тревожно
						return {status: 202, code: 4,message: 'Непредвиденные проблемы с записью! Если вы читаете это сообщение, обязательно сообщите нам! Это наша ошибка!'}
					} 
				}
			}
		}
	}
	catch (err)
	{
		return {status: 418, message: err}
	}
} 
exports.TakeIn = async function(data, index, sessionName)
{
	try 
	{
		if(!data.group_id || !data.student_id) throw new Error('no group_id or student_id');

		//В первую очередь даем студенту группу
		let updated = await model.UpdateStudent({group_id: data.group_id, student_id: data.student_id});

		if(updated[0].affectedRows>0)
		{
			//Если все ок, удаляем его запрос, т.к. мы его удовлетворили
			let deleted = await model.DeleteReq({student_id: data.student_id});
			if(deleted[0].affectedRows > 0)
			{
				//когда обработали запрос, нужно сообщить об этом студенту
				//берем его chat_id
				let [chat, fl] = await model.Chat({student_id: data.student_id});
				let chat_id = chat[0].chat_id;
				
				//берем название группы, в которую его записали
				let group_name = await model.GroupName({group_id});
				group_name = group_name[0].group_name;

				//Сообщаем ему новость
				sendMessage({notice: 2, chat_id: chat_id, group_id: data.group_id, text: 'Преподаватель '+ sessionName +' добавил вас в группу "'+ group_name +'"! Совсем скоро мы составим ваше расписание!'});

				let check_sh = await model.CheckSh({group_id: data.group_id});
				//Расписания нет
				if(check_sh[0].length == 0)
				{
					let check_amount = await model.ChechAmount({group_id: data.group_id});
					//Количество студентов удовлетворительное
					if(check_amount[0][0].count >= config.min_students)
					{

						//Теперь составим расписание для этой группы
						let group_id = data.group_id;
						let enough = false;
						let today = new Date();
						let count = 0;
						let lessons = await model.Lessons({group_id});
						lessons = lessons[0][0].lessons;

						console.log('Нужно уроков: ' + lessons )

						let Greq = await model.Greq({group_id});
						Greq = Greq[0];

						while(!enough)
						{
							let m = today.getMonth() + 1;
							let day = today.getFullYear() + '-' + m + '-' + today.getDate(); 

							console.log('Проверяем день: ' + today);

							let ms = [];

							for(let i = 0; i<Greq.length; i++)
							{
								if(today.getDay() == Greq[i].nday)
								{
									let dailychart = await model.DailyChartD({index, day})

									let kol = 0;

									for(let d = 0; d < dailychart[0].length; d++)
									{
										if(cross(Greq[i].start_time, Greq[i].finish_time
											, dailychart[0][i].start_time, dailychart[0][i].finish_time))
										{
											kol++;
										}
									}

									if(kol < config.groups)
									{
										console.log('Подходит день!');
										ms.push(Greq[i].start_time);
										ms.push(Greq[i].finish_time);
									}
								}
							}

							for(let i = 0; i<ms.length; i=i+2)
							{

								console.log('Создаем урок');
								let insert = await model.CreateChart({group_id, day, ms1: ms[i], ms2: ms[i+1], count: count+1});
								count ++;
								if(count == lessons) 
								{
									enough = true;
									break;
								}
							}
							if(enough) break;
							today = new Date(today.valueOf() + 1000*60*60*24);
						}

						await model.DeleteGroupReq({group_id: data.group_id})

						sendMessage({notice: 6, group_id: data.group_id });
					}
				}

				return {status: 200, message: 'запрос обработан'};
			}
			else
			{
				//Если запрос не удален, то придется его еще раз обрабатывать
				return {status: 202, message: 'запрос не удален'};
			}
		}
		else
		{
			//Если у студента уже есть эта группа, то....
			//Это нереально 
			return {status: 202, message: 'запрос не обработан'}
		}
		

	}
	catch (err)
	{
		return {status: 418, message: err}
	}
}
exports.GetGroups = async function(data, index)
{
	try 
	{
		if(!data.student_id) throw new Error('no student_id');

		let mas = [];
		let lvls = await model.SelectLevel({student_id: data.student_id});
		let lvl = lvls[0].lvl;
		let reqs = await model.SelectReq({student_id: data.student_id});
		let groups = await model.Groups({lvl, index, reqs: reqs[0].rate_id, config});

		console.log('Всего групп');
		console.log(groups)

		if(groups.length > 0)
		{
			for(let i = 0; i<groups.length; i++ )
			{
				let group = groups[i];

				console.log('Проверяем группу:')
				console.log(group)

				let gr_req = await model.GrReq({group});
				gr_req = gr_req[0]
			
				let ok = true;

				for(let j = 0; j < gr_req.length; j++)
				{
					let notOk = true; 
					let gr = gr_req[j];
					console.log('Сравниваем: ')
					console.log(gr)
					console.log('с')
					for(let c = 0; c < reqs.length; c++)
					{
						let req = reqs[c];
						console.log(req);
						if(gr.start_time >= req.start_time && gr.finish_time<= req.finish_time && gr.nday == req.nday)
						{
							console.log('Есть совпадение!')
							notOk = false;
						}
					}

					if(notOk)
					{
						console.log('Ни одного совпадения')
						ok = false;
						break;
					}
				}

				if(ok)
				{
					console.log('Добавили группу')
					mas.push(group);
				}
			}
			return {status: 200, mas: mas};
		}
		else
		{
			return {status: 200, mas: []};
		}
	}
	catch (err)
	{
		return {status: 418, message: err}
	}
}
exports.Get = async function(data, index)
{
	let levels = await model.TeacherLevel({index})
	let level = levels[0].lvl;
	let re 	= await model.Re({index, level});

	if(re.length >0)
	{
		return {status: 200, body: re[0]};
	}
	else
	{
		return {status: 202, message: 'not found'};
	}
}
exports.GetGraph = async function(data, index)
{
	try
	{
		if(!data.student_id) throw new Error('no student_id');

		let select = await model.Select({student_id: data.student_id});

		if(select[0].length > 0)
		{
			return {status: 200, body: select[0]};
		}
		else
		{
			return {status: 202, message: 'not found'}
		}
	}
	catch (err)
	{
		return {status: 418, message: err};
	}
	
}







