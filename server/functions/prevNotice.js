let botMessage = require('/botMessage');
let SQL = require('../database/query');

//Функция для уведомления преподов и студентов о приближении уроков

module.exports = async function prevNotice(date, today)
{
	let start = Number(date.getHours()) + 1;
	let [groups, fields1] = await SQL('select group_id from chart where day = ? and start_time = ?', [today, start]);
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
			msg 		: ''
		} 

		if(group_type) 
			body.msg = 'Через час в '+start+':00 у вас занятие со студентом <a href="/student?id='+student_id+'">'+lastname +' '+ firstname +'</a>!';
		else 
			body.msg = 'Через час в '+start+':00 у вас занятие с группой <a href="/group?id='+group_id+'">'+group_name+'</a>!';
		
		let delievered = false;
		socket.clients.forEach( (ws) => 
			{
				if (ws.userid === teacher_id)
				{
					ws.send(JSON.stringify(body));
					delievered = true;
				}
			});

		if(!delievered)
		{
			let ins;
			if(group_type) 
				ins = await SQL('insert into notice(teacher_id, content) values(?,?)'
				,[teacher_id, 'В '+ start+':00 у вас начнется занятие со студентом <a href="/student?id='+student_id+'">'+lastname +' '+ firstname +'</a>!']);
			else
				ins = await SQL('insert into notice(teacher_id, content) values(?,?)'
				,[teacher_id, 'В '+ start+':00 у вас начнется занятие с группой <a href="/group?id='+group_id+'">'+group_name+'</a>!']);
		}

		botMessage(config.bot, {group_id, notice: 0, text: 'Ваше занятие начнется через один час!'});

	}
}