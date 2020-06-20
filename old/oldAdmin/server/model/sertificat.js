const SQL = require('../functions/query');

// Выборка
	exports.getMySertificats = async function(myId) {
		return await SQL(`select s.id, s.student, s.rate, s.filename, s.dt, r.rate_name 
			from sertificat s 
			join rate r on r.rate_id = s.rate
			where student = ?`, myId)
	}
// Вставка

// Изменение 

// Удаление