let SQL = require('../functions/query')

// Выборка
	exports.getGroup = async function(id) {
		return (await SQL('select * from gr where group_id = ?', id))[0]
	}
	exports.getGroupRate = async function(id) {
		return (await SQL(`select r.rate_id, r.rate_name, r.rate_title, r.rate_cost, 
			r.lessons, r.unlim, r.group_type, r.rate_content, 
			r.sale, r.oldCost, r.active 
			from gr 
			join rate r on r.rate_id = gr.rate_id 
			where gr.group_id = ?`, id))[0]
	}
	exports.getGroupTeacher = async function(id) {
		return (await SQL(`select t.teacher_id, t.login firstname, t.lastname, t.ava, t.rating 
			from gr join teacher t on t.teacher_id = gr.teacher_id 
			where gr.group_id = ?`, id))[0]
	}

// Вставка
	exports.addGroup = async function(teacher, name, rate_id) {
		let res = await SQL('insert into gr(teacher_id, group_name, group_type, rate_id) values(?, ?, 1, ?)', [teacher, name, rate_id])
		return res.affectedRows>0? res.insertId: false
	}

// Удаление

// Изменение