let SQL = require('../apiFunctions/query')

// select 
	exports.getQuestions = async (testId) => {
		return await SQL(`select * from question where test_id = ?`, [testId])
	}

// insert
	exports.createQuestion = async (testId, questTitle, variants, correct, weight) => {
		return (await SQL(` insert into question(test_id, quest_title, variants, correct, weight) values (?,?,?,?,?)`, 
							[testId, questTitle, variants, correct, weight])).insertId
	}
	
// update
 
// delete   
	exports.deleteQuestions = async (testId) => {
		return (await SQL(`delete from question where test_id = ?`, [testId])).affectedRows
	}