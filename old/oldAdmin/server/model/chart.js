const SQL = require('../functions/query');

// Выборка
	exports.getChart = async function(student_id) {
		return await SQL(`SELECT g.group_type, r.rate_name, g.group_id, 
							c.start, c.finish, l.lvl_name
							FROM student AS s 
							JOIN gr AS g ON s.group_id = g.group_id
							JOIN chart AS c ON g.group_id = c.group_id
							JOIN rate AS r ON r.rate_id = g.rate_id
							JOIN lvl AS l ON l.lvl_id = s.lvl
							WHERE s.student_id = ?`, student_id)
	}

	exports.getChartBeetween = async function(student_id, start, finish) {
		return await SQL(`	SELECT g.group_type, r.rate_name, g.group_id, 
							c.start, c.finish, l.lvl_name
							FROM student AS s 
							JOIN gr AS g ON s.group_id = g.group_id
							JOIN chart AS c ON g.group_id = c.group_id
							JOIN rate AS r ON r.rate_id = g.rate_id
							JOIN lvl AS l ON l.lvl_id = s.lvl
							WHERE s.student_id = ?
							AND ((c.start >= ? and c.start <= ?) or (c.finish >= ? and c.finish <= ?))`, 
							[student_id, start, finish, start, finish]);
	}

	exports.countCrosses = async function(teacher, start, finish) {
		return (await SQL(`
			select count(*) as cnt 
			from chart c left 
			join gr g on g.group_id = c.group_id and g.teacher_id = ?
			where (start < ${start} && finish > ${start} ) 
			|| (start < ${finish} && finish > ${finish})  
			|| (start = ${start} && finish = ${finish}) 
			|| (start > ${start} && start < ${finish})
			|| (finish > ${start} && finish < ${finish})`, teacher ))[0].cnt
	}

	exports.getNext = async function(student_id) {
		return (await SQL('select min(start) as start from chart c join student s on c.group_id = s.group_id where s.student_id = ?', student_id))[0].start
	}

// Вставка
	exports.addLesson = async function(group, start, finish, n) {
		return (await SQL('insert into chart( group_id, start, finish, lesson) values (?, ?, ?, ?)', [group, start, finish, n])).affectedRows
	}
// Изменение 

// Удаление