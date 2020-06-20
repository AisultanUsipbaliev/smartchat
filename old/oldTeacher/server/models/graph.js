/*тут был Анвар 20.11.2018 10:25*/
let SQL = require('../modules/query')

exports.getGraph = async function(teacher_id) {
	return await SQL('select * from graph where teacher_id = ? order by nday', teacher_id)
}

exports.getChart = async function(teacher_id) {
	return await SQL('select * from chart c join gr on gr.group_id = c.group_id where gr.teacher_id = ?', teacher_id)
}

exports.deleteGraph = async function(teacher_id) {
	return (await SQL('delete from graph where teacher_id = ?', teacher_id)).affectedRows>0? true:false 
}
 
exports.createGraph = async function(teacher_id, start_time, finish_time, nday) {
	return (await SQL('insert into graph(teacher_id, start_time, finish_time, nday) values (?,?,?,?)',
		[teacher_id, start_time, finish_time, nday])).affectedRows > 0? true: false
}

exports.getTeacher = async function(id) {
	return (await SQL('select * from teacher where teacher_id = ?', id))[0]
}