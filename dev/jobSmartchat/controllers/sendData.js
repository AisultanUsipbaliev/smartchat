let SQL 			= require('../../apiFunctions/query')
let getHash			= require('../../apiFunctions/getHash')
let teacherModel 	= require('../../apiModels/teacher')

module.exports = async (req, res) => {

	try {

		if(!req.body.firstname) 	return res.sendStatus(418)
		if(!req.body.lastname) 		return res.sendStatus(418)
		if(!req.body.email) 		return res.sendStatus(418)
		if(!req.body.phone) 		return res.sendStatus(418)
		if(!req.body.answers) 		return res.sendStatus(418)
		if(!req.body.resume)		return res.sendStatus(418)
		if(!req.body.audioResume)	return res.sendStatus(418)

		let teacher = await teacherModel.findPhone(req.body.phone) ||  await teacherModel.findEmail(req.body.email)
		if(teacher) return res.sendStatus(400)
			
		let answers = req.body.answers
		let test = await SQL('select * from test_level')
		let count = 0
		let password = await getHash('smartchat')

		for(i=0; i<test.length; i++) if( answers[i].toLowerCase() == test[i].correct.toLowerCase() ) count++

		await teacherModel.newTeacher(req.body.firstname, req.body.lastname, req.body.email, req.body.phone, password, req.body.resume, count, req.body.audioResume)
		writeAction(`${req.body.firstname} ${req.body.lastname} прошел собеседование с ботом.\nРезюме: ${config.jobHostname}/common/files/${req.body.resume}\nАудио резюме: ${config.jobHostname}/common/files/${req.body.audioResume}\nРезультаты теста: ${count}/${test.length}\nНомер телефона: ${req.body.phone}\nEmail: ${req.body.email}`, 1)
		
		res.status(200).json({count})
	
	} catch(err) {
		console.error(err)
		sayMe('jobSmartchat/sendData', {}, err.message)
		res.sendStatus(405)
	}
}