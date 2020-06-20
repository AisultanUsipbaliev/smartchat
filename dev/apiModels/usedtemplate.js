let SQL = require('../apiFunctions/query')

// Select

// Update

// Insert
	
// Delete
	exports.delete = async (groupId) => {
		return (await SQL(`delete from usedtemplate where group_id = ?`, [groupId])).affectedRows
	}