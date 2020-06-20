const SQL = require('../functions/query');

// Выборка
	exports.getTestQuestions = async function(testId) {
		return await SQL('select * from question where test_id = ?', testId)
	}
// Вставка

// Изменение 

// Удаление