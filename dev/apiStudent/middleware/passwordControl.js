let SQL = require('../functions/query');

//Для обыного входа в систему студенту нужны SAI, SAP, SAU
//Для входа через соц. сеть нужно SAI, SI, ST 

//SAI - id 				- индекс студента в системе
//SAP - password 		- пароль студента
//SAU - phone			- телефон студента
//SI  - socialId 		- индекс студента в соц сети
//ST  - socialType 		- тип социальной сети (0 - facebook, 1 - telegram, 2 - mail.ru, 3 - goolge, 4 - vkontakte)

module.exports = async function(req, res, next) {

	if(req.cookies.SAU && req.cookies.SAP && req.cookies.SAI) {

		let select = await SQL('select * from student where phone = ? and pass = ? and student_id = ?',
			[req.cookies.SAU, req.cookies.SAP, req.cookies.SAI])
		
		if(select.length < 1) {

			req.body.myId = null
			res.clearCookie('SAP')
			res.clearCookie('SAI')
			res.clearCookie('SAU')
		
		} else req.body.myId = req.cookies.SAI

	} else if(req.cookies.SAI && req.cookies.SI && req.cookies.ST && req.cookies.STO) {

		let select = await SQL('select * from student where student_id = ? and socialId = ? and socialType = ? and socialToken = ?', 
			[req.cookies.SAI, req.cookies.SI, req.cookies.ST, req.cookies.STO])
		
		if(select.length < 1) {

			req.body.myId = null
			res.clearCookie('SAI') 
			res.clearCookie('SI') 
			res.clearCookie('ST')

		} else req.body.myId = req.cookies.SAI

	} else {

		req.body.myId = null
		res.clearCookie('SAP'); res.clearCookie('SAI'); 
		res.clearCookie('SAU'); res.clearCookie('SI'); 
		res.clearCookie('ST'); res.clearCookie('STO');

	}

	if(req.body.token) {
	
		let student = (await SQL('select * from student where pass = ?', req.body.token))[0]
		if(student) req.body.myId = student.student_id
	
	}

	next()
}