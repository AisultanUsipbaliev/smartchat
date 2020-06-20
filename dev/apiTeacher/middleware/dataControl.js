let teacherModel = require('../../apiModels/teacher')

module.exports = async function(req, res, next) {
	if (!req.cookies.SAI) {
		return res.redirect('/login');
	}  else {
		let teacher = await teacherModel.getTeacher(req.cookies.SAI)

		if(!teacher) 			return res.redirect('/login')
		// if(teacher.blocked) 	return res.sendStatus(401)
		if(!teacher.is_active) 	return res.redirect('/activate?phone='+teacher.phone)

		req.body.myId 		= teacher.teacher_id
		req.body.myName 	= teacher.login + ' ' + teacher.lastname
		req.body.myEmail 	= teacher.email

		next()
	}

}