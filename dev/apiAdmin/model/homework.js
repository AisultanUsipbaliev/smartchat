let SQL = require('../functions/query')

// Выборка
	exports.getHomework = async function(myId, id) {
		return (await SQL('select * from homework h join template t on h.template = t.temp_id where student = ? and id = ?', [myId, id]))[0]
	}

	exports.getHomeworks = async function(myId) {
		return await SQL(`select h.id, h.template, h.checked, h.score, h.filePath, h.dt, c.content, l.lvl_name, t.lesson_num lesson,
			r.rate_name, r.rate_id 
			from student as s
			join lvl l on l.lvl_id = s.lvl
			join homework as h on h.student = s.student_id
			join template as t on t.temp_id = h.template
			join rate as r on r.rate_id = t.rate_id
			left join content c on c.temp_id = h.template and c.type = 1
			where s.student_id = ?
			order by h.dt desc`, myId)
	}
	exports.getHomeworksCount = async function(myId) {
		return (await SQL('select count(*) cnt from homework where student = ? and done = 0', myId))[0].cnt;
	}

// Вставка

// Удаление

// Изменение
	exports.addSolution = async function(myId, id, filePath) {
		return (await SQL('update homework set done = 1, filePath = ? where student = ? and id = ?', [filePath, myId, id])).affectedRows>0
	}