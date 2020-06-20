let SQL = require('../apiFunctions/query')

// select 
	exports.findFile = async (file) => {
		return await SQL('select * from content where content = ?', [file])
	}
	exports.getContents = async (templateId) => {
		return await SQL('select * from content where temp_id = ?', [templateId])
	}
// update

// insert
	exports.addContent = async (id, type, content) => {
		return (await SQL('insert into content (temp_id, type, content) values (?,?,?)', [id, type, content])).insertId
	}
// delete
	exports.deleteContents = async (id) => {
		return (await SQL(`delete from content where temp_id = ?`, [id])).affectedRows
	}