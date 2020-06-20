let SQL = require('../modules/query');

exports.getStudentsByTeacherId = async function(teacher_id) {
	return await SQL(`	select firstname, lastname, ava, student_id 
						from student
						join gr on gr.group_id = student.group_id
						where gr.group_id in 
						(select group_id from .gr where teacher_id = ?)`, teacher_id);
}

exports.getStudentByStudentId = async function(student_id) {
	return await SQL(`	select firstname, lastname, phone, email, ava, student_id, s.group_id,
						g.group_name, g.group_type, l.lvl_name, r.rate_name, r.lessons 
						from student s
						join lvl l on l.lvl_id = s.lvl 
						join gr g on g.group_id = s.group_id 
						join rate r on r.rate_id = g.rate_id
						where student_id = ?`, student_id);
}