let SQL = require('../apiFunctions/query')

// select 
	exports.getTemplates = async (teacherId, rateId, levelId, lessonNum) => {
		return (await SQL(`
			select temp_id, teacher_id, rate_id, l.lvl_id, l.lvl_name, lesson_num, t.order
			from template t 
			join lvl l on l.lvl_id = t.lvl_id
			where teacher_id = ?
			and t.lvl_id = ?
			and rate_id = ?
			and lesson_num = ? 
			and deleted = false 
			order by t.order`, [teacherId, levelId, rateId, lessonNum]))
	}
	exports.getContents = async (id) =>	{
		return await SQL(`select * from content where temp_id = ?`, [id])
	}
	exports.getTemplate = async (teacherId, id) => {
		return (await SQL(`select * from template where teacher_id = ? and temp_id = ?`, [teacherId, id]))[0]
	}

// insert

	exports.addTemplate = async (teacherId, rateId, levelId, lessonNum) => {
		return (await SQL(`insert into template (teacher_id, rate_id, lvl_id, lesson_num) values (?,?,?,?)`, [teacherId, rateId, levelId, lessonNum])).insertId
	}
	exports.addContent = async (id, type, content) => {
		return (await SQL('insert into content (temp_id, type, content) values (?,?,?)', [id, type, content])).insertId
	}
	
// update
	exports.changeOrder = async (id, order) => {
		return (await SQL(`update template t set t.order = ? where t.temp_id = ?`, [order, id])).affectedRows
	}
	exports.deleteTemplate = async (id) => {
		return (await SQL(`update template set deleted = true where temp_id = ?`, [id])).affectedRows
	}

// delete
	exports.deleteContents = async (id) => {
		return (await SQL(`delete from content where temp_id = ?`, [id])).affectedRows
	}