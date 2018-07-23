let model = require('../models/schedule');
let config = require('../config');
 
exports.Get = async function(data, index)
{
	if (!data.day) 
	{
		let selected = model.SelectedS({index});

		if(selected[0].length>0)
		{
			return {status: 200, body: selected[0]}
		}
		else
		{
			return {status: 202, message: 'Нет занятий!'}
		}
	} 
	else 
	{
		let selected = model.SelectedD({index, day: data.day});

		if(selected[0].length>0)
		{
			return {status: 200, body: selected[0]}
		}
		else
		{
			return {status: 202, message: 'Нет занятий!'}
		}
	}
}
exports.GetFull = async function(data, index)
{
	try
	{
		if (!data.firstday || !data.lastday) throw new Error('no firstday or lastday');
		//Красные дни
		let redDays = [];
		let curdate = new Date(data.firstday);
		let lastday = new Date(data.lastday);

		let all_chart = await model.AllChart({index});
		if(all_chart.length>0)
		{
			let graph = await model.Graph({index});
			if(graph.length > 0)
			{
				for(;;)
				{
					// Все занятия в этот день
					let lessons = [];
					for(let i=0; i<all_chart.length; i++)
					{
						let chart_day = new Date(all_chart[i].day);
						if(chart_day.getDate() == curdate.getDate()
							&&chart_day.getMonth() == curdate.getMonth()
							&&chart_day.getFullYear() == curdate.getFullYear())
							lessons.push(all_chart[i]);
					}

					if(lessons.length > 0)
					{
						// Время работы в этот день
						let start 	= 0;
						let finish 	= 0;
						for(let i = 0; i<graph.length; i++)
						{
							if(graph[i].nday == curdate.getDay())
							{
								start 	= graph[i].start_time;
								finish 	= graph[i].finish_time;
							}
						}
						let isred = true;
						if(start == 0 && finish == 0) isred = false;
						//Осталось проверить красный этот день или нет
						for(let i = start; i<finish; i++)
						{
							let count = 0;
							for(let j=0; j<lessons.length; j++)
							{
								if(i >= lessons[j].start_time && i+1 <= lessons[j].finish_time) count++;
							}
							if(count < config.groups)
							{
								isred = false;
								break;
							}
						}
						if(isred)
						{
							redDays.push(curdate);
						}
						else
						{

						}
					}
					curdate = new Date(curdate.valueOf() + 1000*60*60*24);
					if(	curdate.getDate() == lastday.getDate() 
						&& curdate.getMonth() == lastday.getMonth() 
						&& curdate.getFullYear() == lastday.getFullYear())
						break;
				}
				return {status: 200, mas: redDays}
			}
			else
			{
				return {status: 200, mas: []}
			}
		}
		else
		{
			return {status: 200, mas: []}
		}
	}
	catch (err)
	{
		return {status: 418, message: 'no firstday or lastday'};
	}
}





















 
