const SQL = require('../functions/query');

// Выборка
	exports.getAllChart = async function(student_id) {
		return await SQL(`select * from chart`, student_id)
	}

	exports.startBeetween = async function(start, finish) {
		return await SQL(`select group_id from chart where start > ? and start < ?`, [start, finish])
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

// Вставка
	exports.addLesson = async function(group, start, finish, lesson) {
		return (await SQL('insert into chart( group_id, start, finish, lesson) values (?, ?, ?, 1)', [group, start, finish])).affectedRows > 0? true: false
	}
// Изменение 

// Удаление