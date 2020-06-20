let SQL = require('../apiFunctions/query')

// select 
	exports.getContents = async (quizId) => {
		return await SQL('select * from quizContent where quiz = ? order by position', quizId)
	}
// insert
	exports.add = async (quizId, type, content, position) => {
		return (await SQL(`insert into quizContent(quiz, type, content, position) values (?,?,?,?)`,  
			[quizId, type, content, position])).insertId
	}
// update
		
// delete
	exports.delete = async (id) => {
		return (await SQL('delete from quizContent where id = ?', id)).affectedRows
	}
	exports.deleteAll = async (quizId) => {
		return (await SQL('delete from quizContent where quiz = ?', quizId)).affectedRows
	}