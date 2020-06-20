const SQL = require('../database/query');

exports.getGroupInfoByStudentId = async function(student_id)
{
	return await SQL(`  SELECT gr.group_id, gr.group_name, gr.started, gr.group_type, gr.teacher_id, gr.rate_id 
						from gr
						join student on student.group_id = gr.group_id
						WHERE student.student_id = ?`, [student_id]);
}

exports.getRateInfoByRateId = async function(rate_id)
{
	return await SQL(`  select rate.rate_id, rate.rate_name, rate.rate_title, rate.rate_cost, rate.lessons, rate.unlim, rate.group_type, rate.rate_content 
			 			from rate where rate.rate_id = ?`, [rate_id])
}

exports.getTeacherInfoByTeacherId = async function(teacher_id)
{
	return await SQL(`	select teacher.teacher_id, concat(teacher.login, " ", teacher.lastname) as fio, teacher.ava, teacher.lvl
						from teacher where teacher_id = ?`, [teacher_id]);
}

exports.getStudentListByGroupId = async function(group_id)
{
	return await SQL(`  select student.student_id, concat(student.firstname, " ", student.lastname) as fio, student.ava, student.phone, student.email, student.lvl, student.birthday
						from student where student.group_id = ?`, [group_id]);
}