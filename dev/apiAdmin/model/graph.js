let SQL = require('../functions/query')

// Выборка
	exports.getTeacherGraph = async function(teacher){
		return await SQL(`select graph.nday, graph.start_time, graph.finish_time 
		from graph 
		where graph.teacher_id = ?`, [teacher])
	}
// Вставка

// Удаление

// Изменение