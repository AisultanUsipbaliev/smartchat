let model = require('../models/graph');
 
exports.Get = async function(index)
{
	try
	{
		if(!index) throw new Error('index is undefined');
		
		let selected = model.selectGraph({index});

		if(selected.length > 0)
		{
			return {status: 200, body: selected}
		}
		else
		{
			return {status: 202, message: 'not found'}
		}
	}
	catch (err)
	{
		return {status: 418, message: err}
	}
}
exports.Post = async function(data, index)
{
	try
	{
		if (!index) throw new Error('no index');
		if (!data.mas) 
		{
			return {status: 418, message: 'no mas'};
		} 
		else 
		{
			let fl = true;
			let mas = data.mas.split(',');
			let chart = await model.selectChart({index});
			
			for(let i = 0; i<chart.length; i++)
			{
				let flag = false;
				let date = new Date(chart[i].day);
				for(let j = 0; j< mas.length; j = j +3)
				{
					if(mas[j+2] == date.getDay())
					{
						if(mas[j] <= chart[i].start_time && mas[j+1] >= chart[i].finish_time)
						{
							flag = true;
						}
					}
				}
				if(!flag)
				{
					fl = false;
					return {status: 202, message: 'У вас занятие, а вы удаляете!', day: date.getDay(), start: chart[i].start_time, finish: chart[i].finish_time}
					break;
				}
			}
			if(fl)
			{
				let deleted = await model.deletedGraph({index});

				for(let i = 0; i< mas.length; i = i + 3)
				{
					let inserted = await model.insertedGraph({index, mas: mas[i], mas1: mas[i+1], mas2: mas[i+2]});
				}

				return {status: 200, message: 'ok'};
			}


		}
	}
	catch (err)
	{
		return {status: 418, message: err}
	}
}




