let botMessage = require('/botMessage');
let SQL = require('../database/query');
//Функция для уведомления преподов и студентов об окончании урока, закрывающая stream и уменьшающая nles
module.exports = async function(date, today)
{
	let finish = date.getHours();
	let groups = await SQL('select group_id from chart where day = ? and finish_time = ?', [today, finish]);

	for(let i = 0; i<groups.length; i++)
	{
		let [group_info] = await SQL('select * from gr where group_id = ?', groups[i].group_id);
		let [students_info] = await SQL('select * from student where group_id = ?', groups[i].group_id);

		let student_id  = students_info.student_id;
		let firstname 	= students_info.firstname;
		let lastname 	= students_info.lastname;
		let teacher_id 	= group_info.teacher_id;
		let group_type 	= group_info.group_type;
		let group_id 	= group_info.group_id;
		let group_name 	= group_info.group_name;

		body = 
		{
			socket_type : 2,
			msg 		: '',
			group_id 	: group_id,
			group_name 	: group_name
		} 

		if(group_type) body.msg = 'Закончилось занятие со студентом <a href="/student?id='+student_id+'">'+lastname +' '+ firstname +'</a>!';
		else body.msg = 'Закончилось занятие с группой <a href="/group?id='+group_id+'">'+group_name+'</a>!';

		await SQL('delete from usedtemplate where group_id = ?', group_id);
		await SQL('update teacher set les_count = les_count + 1  where teacher_id = ?', teacher_id);

		socket.clients.forEach( (ws) => 
			{
				if (ws.userid === teacher_id)
				{ 
					ws.send(JSON.stringify(body));
				}
			});

		let update = await SQL('update student set stream = 0, nles = nles-1 where group_id = ?', group_id);

		botMessage(config.bot, {group_id, notice: 0, text: 'Ваше занятие закончилось!'});
	}
}