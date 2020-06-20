let SQL = require('../modules/query');

exports.getGroupsByTeacherId = async function(teacher_id) {
	return await SQL(`	select count(student.student_id) as quantity, gr.group_id, gr.group_name 
						from .gr 
						left join .student on student.group_id = gr.group_id 
						where gr.teacher_id = ? 
						and gr.group_type = 0 
						group by gr.group_id`, teacher_id)
}

exports.getStudentsByGroupId = async function(group_id) {
	return await SQL(`	select firstname, lastname, student_id 
						from .student 
						where  student.group_id = ?`, group_id)
}

exports.updateGroup = async function(group_name, group_id)  {
	return (await SQL('	update gr set group_name = ? where group_id = ?',
		[group_name, group_id])).affectedRows > 0? true: false
} 

exports.deleteGroup = async function(group_id) {
	return (await SQL('delete from .gr where group_id = ?', group_id)).affectedRows>0? true:false
} 