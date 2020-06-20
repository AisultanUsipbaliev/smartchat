let SQL = require('../functions/query')

// Выборка
	exports.getMyNF = async function(myId){
		return await SQL(`
			select nf.id, nf.student, nf.teacher, t.login firstname, t.lastname, t.ava 
			from needFeedback nf 
			left join teacher t on nf.teacher = t.teacher_id
			where student = ?`, myId)
	}
// Вставка

// Удаление
	exports.deleteMyNf = async function(myId, teacher){
		return (await SQL('delete from needFeedback where student = ? and teacher = ?', [myId, teacher])).affectedRows>0
	}
// Изменение