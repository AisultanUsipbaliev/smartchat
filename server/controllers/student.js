let model = require('../models/student');

exports.Get = async function(data, index)
{
	if(!data.student_id)
	{
		let students = await model.Students({index});
		console.log(students)
		if(students.length > 0)
		{
			return {status: 200, students: students};
		}
		else
		{
			return {status: 200, message: 'not found'};
		}
	}
	else
	{
		let student = await model.Student({student_id: data.student_id});
		let dat = await model.Dat({student_id: data.student_id});
		if(dat.length > 0)
		{
			let date1 = new Date(dat[0].day);
			let value = date1.valueOf() + 60*60*24*8*1000;
			let date2 = new Date(value);

			let m1 = date1.getMonth()+1;
			let m2 = date2.getMonth()+1;

			let dateone = date1.getFullYear() + '-' + m1 + '-' + date1.getDate();
			let datetwo = date2.getFullYear() + '-' + m2 + '-' + date2.getDate();

			let chart = await model.Chart({student_id: data.student_id, dateone, datetwo})
			if(student.length > 0)
			{
				if (chart.length > 0) 
				{
					return {status: 200, student: student, chart: chart}
				} 
				else 
				{
					return {status: 200, student: student, chart: null}
				}
			}
			else
			{
				return {status: 200, message: 'not found'}
			}
		}
		else
		{
			return {status: 200, student: student, chart: null}
		}

	}
}
 