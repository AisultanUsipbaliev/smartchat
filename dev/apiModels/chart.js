let SQL = require('../apiFunctions/query')

// select
	exports.getBetweenStart = async(before, after) => {
		return await SQL('select group_id, lesson from chart where start > ? and start < ?', [before, after])
	}
	exports.getBetweenFinish = async(before, after) => {
		return await SQL('select group_id, lesson from chart where finish > ? and finish < ?', [before, after])
	}
	exports.getTrialBetween = async(before, after) => {
		return await SQL('select c.group_id from chart c join gr on c.group_id = gr.group_id where gr.rate_id = 1 and c.start > ? and c.start < ?', [before, after])
	}
	exports.getNextLesson = async (groupId) => {
		return (await SQL('select min(lesson) lesson from chart where group_id = ?', [groupId]))[0].lesson
	}
	exports.getExpiredChart = async(now) => {
		return await SQL('select chart_id from chart where finish < ?', [now])
	}
	exports.getStudentChart = async (studentId) => {
		return await SQL(`SELECT g.group_type, r.rate_name, g.group_id, 
							c.start, c.finish, l.lvl_name
							FROM student AS s 
							JOIN gr AS g ON s.group_id = g.group_id
							JOIN chart AS c ON g.group_id = c.group_id
							JOIN rate AS r ON r.rate_id = g.rate_id
							JOIN lvl AS l ON l.lvl_id = s.lvl
							WHERE s.student_id = ?`, [studentId])
	}
	exports.getStudentChartBeetween = async (studentId, start, finish) =>{
		return await SQL(`	SELECT g.group_type, r.rate_name, g.group_id, 
							c.start, c.finish, l.lvl_name
							FROM student AS s 
							JOIN gr AS g ON s.group_id = g.group_id
							JOIN chart AS c ON g.group_id = c.group_id
							JOIN rate AS r ON r.rate_id = g.rate_id
							JOIN lvl AS l ON l.lvl_id = s.lvl
							WHERE s.student_id = ?
							AND ((c.start >= ? and c.start <= ?) or (c.finish >= ? and c.finish <= ?))`, 
							[studentId, start, finish, start, finish]);
	}
	exports.getTeacherChart = async (teacherId) => {
		return await SQL(`select c.group_id, c.lesson, c.start, c.finish, g.group_name, g.group_type, g.rate_id, r.rate_name
			from chart c 
			join gr g on g.group_id = c.group_id 
			join rate r on r.rate_id = g.rate_id
			where g.teacher_id = ? order by c.start`, [teacherId])
	}
	exports.getTeacherChartBetween = async (teacherId, start, finish) => {
		return await SQL(`select c.group_id, c.lesson, c.start, c.finish, g.group_name, g.group_type, g.rate_id, r.rate_name
			from chart c 
			join gr g on g.group_id = c.group_id 
			join rate r on r.rate_id = g.rate_id
			where g.teacher_id = ? 
			and finish > ? and start < ? order by c.start`, [teacherId, start, finish])
	}
	exports.getTeacherChartBetween2 = async (teacherId, start) => {
		return await SQL(`select c.group_id, c.lesson, c.start, c.finish, g.group_name, g.group_type, g.rate_id, r.rate_name
			from chart c 
			join gr g on g.group_id = c.group_id 
			join rate r on r.rate_id = g.rate_id
			where g.teacher_id = ? and c.start > ? order by c.start limit 5`, [teacherId, start])
	}
	// exports.getTeacherChartBetween3 = async (teacherId, start, finish) => {
	// 	return await SQL(`select c.group_id, c.lesson, c.start, c.finish, g.group_name, g.group_type, g.rate_id, r.rate_name
	// 		from chart c 
	// 		join gr g on g.group_id = c.group_id 
	// 		join rate r on r.rate_id = g.rate_id
	// 		where g.teacher_id = ? 
	// 		and finish > ? and start < ? order by c.start limit 5`, [teacherId, start, finish])
	// }

	exports.countCrosses = async (teacherId, start, finish) => {
		return (await SQL(`
			select count(*) as cnt 
			from chart c left 
			join gr g on g.group_id = c.group_id and g.teacher_id = ?
			where (start < ? && finish > ? ) 
			|| (start < ? && finish > ?)  
			|| (start = ? && finish = ?) 
			|| (start > ? && start < ?)
			|| (finish > ? && finish < ?)`, 
			[teacherId, start, start, finish, finish, start, finish, start, finish, start, finish,] ))[0].cnt
	}


// update
	exports.update = async (chart_id, start, finish, lesson) => {
		return (await SQL('update chart set  start = ?, finish = ?, lesson = ? where chart_id = ?', [start, finish, lesson, chart_id])).affectedRows > 0 ? true: false;
	}
	
// insert 
	exports.addLesson = async (groupId, start, finish, lesson) => {
		return (await SQL('insert into chart( group_id, start, finish, lesson) values (?, ?, ?, ?)', [groupId, start, finish, lesson])).affectedRows
	}
// delete
	exports.delete = async (id) => {
		return (await SQL('delete from chart where chart_id = ?', [id])).affectedRows
	}