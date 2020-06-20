let SQL = require('../functions/query')

// Выборка 
	exports.getStudent = async function(id) {
		return (await SQL('select * from student where student_id = ?', id))[0]
	}

	exports.findPhone = async function(phone) {
		return (await SQL('select * from student where phone = ?', phone))[0]
	}
	exports.findGuide = async function(guide) {
		return (await SQL('select * from student where guide = ?', guide))[0]
	}
	exports.findSocial = async function(socialId, socialType, socialToken) {
		return (await SQL('select * from student where socialType = ? and socialId = ? and socialToken = ?', 
			[socialType, socialId, socialToken]))[0]
	}
	exports.findGroup = async function(group) {
		return await SQL('select * from student where group_id = ?', group)
	}

	exports.getStudentGroup = async function(id) {
		return (await SQL('select g.group_id, g.teacher_id, g.group_name, g.started, g.group_type, g.rate_id from student s join gr g on s.group_id = g.group_id where s.student_id = ?', id))[0]
	}

	exports.getStudentLevel = async function(id) {
		return (await SQL('select l.lvl_id id, l.lvl_name name from student s join lvl l on l.lvl_id = s.lvl where s.student_id = ?', id))[0]
	}

	exports.getStudentRate = async function(id) {
		return (await SQL(`select r.rate_id id, r.rate_name name, r.rate_title, r.rate_cost cost, r.lessons, r.group_type, r.rate_content, r.sale, r.oldCost, r.active
					from student s 
					join gr g on g.group_id = s.group_id
					join rate r on r.rate_id = g.rate_id
					where s.student_id = ?`, id))[0]
	}

// Вставка

// Изменение
	exports.updateGroup = async function(id, group) {
		return (await SQL('update student set group_id = ? where student_id = ?', [group, id])).affectedRows>0?true:false
	}
	exports.updateStream = async function(id, stream) {
		return (await SQL('update student set stream = ? where student_id = ?', [stream, id])).affectedRows>0?true:false
	}
	exports.updateGuide = async function(id, guide) {
		return (await SQL('update student set guide = ?, guideUsed = 0 where student_id = ?', [guide, id])).affectedRows>0?true:false
	}	
// Удаление