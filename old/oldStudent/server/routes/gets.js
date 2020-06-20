let md5 = require('md5')
let axios 	= require('axios')
let bcrypt 	= require('bcryptjs')
let request = require("async-request")
let router 	= require('express').Router();
let SQL 	= require('../database/query');
let sms 	= require('../functions/smsApi')
let amoRequest 	= require('../functions/amoPost')

let updateDealStage = require('../amocrm/updateDealStage')
let amocrmModel 	= require('../model/amocrm')
let studentModel 	= require('../model/student')

router.get('/guide', async (req, res) => {
	console.log('guide')
	let code = req.query.code
	if(!code) return res.redirect(`${config.hostname}/login`)

	let page = 'chat'
	console.log("page: ",code[code.length-1])
	switch(Number(code[code.length-1])) {
		case 1: page = 'profile'; break;
		case 2: page = 'courses'; break; 
	}
	
	let student = await studentModel.findGuide(code)
	if(!student) return res.redirect(`${config.hostname}/login`)
	await studentModel.useGuide(student.student_id)

	if(!student.socialId) {
		await writeAction(`Студент ${student.firstname} ${student.lastname} прошел по ссылке на страницу ${page}`)
		res.cookie('SAU', student.phone, 			1, { maxAge: 900000, httpOnly: true })
		res.cookie('SAP', student.pass, 			2, { maxAge: 900000, httpOnly: true })
		res.cookie('SAI', student.student_id, 		3, { maxAge: 900000, httpOnly: true })
		res.redirect(`${config.hostname}/${page}`)
	} else {
		await writeAction(`Студент ${student.firstname} ${student.lastname} прошел по ссылке на страницу ${page}`)
		res.cookie('SI', 	student.socialId, 		1, { maxAge: 900000, httpOnly: true })
		res.cookie('ST', 	student.socialType, 	2, { maxAge: 900000, httpOnly: true })
		res.cookie('STO', 	student.socialToken,	4, { maxAge: 900000, httpOnly: true })
		res.cookie('SAI', 	student.student_id, 	3, { maxAge: 900000, httpOnly: true })
		res.redirect(`${config.hostname}/${page}`)
	}
	console.log('guide completed')
})

router.get('/activateEmail', async (req, res)=>
	{
		let result = await SQL('update student set activated = 1 where emailCode = ?', req.query.code);
		if(result.affectedRows > 0) res.render('./../../web/views/account/activated', {version: config.version}); //Активировал
		else {
			res.clearCookie('SAP');
			res.clearCookie('SAI');
			res.clearCookie('SAU');
			res.render('./../../web/views/account/accountUnActive', {version: config.version});
		}
	});

router.get('/sign', (req,res) => { 
	if(req.cookies.MMM)	res.render('./../../mobile/views/account/sign', {version: config.version});
	else				res.render('./../../web/views/account/sign', {version: config.version}); 
});

router.get('/registration', (req, res)=> { 
	if(req.cookies.MMM)	res.render('./../../mobile/views/account/registration', {version: config.version});
	else 				res.render('./../../web/views/account/registration', {version: config.version}); 
});

router.get('/activate', (req,res) => { 
	if(req.cookies.MMM) res.render('./../../mobile/views/account/activate', {version: config.version}); 
	else 				res.render('./../../web/views/account/activate', {version: config.version}); 
});

router.get('/restore', (req,res) => { 
	if(req.cookies.MMM)	res.render('./../../mobile/views/account/restore', {version: config.version}); 
	else 				res.render('./../../web/views/account/restore', {version: config.version}); 
});

router.get('/reciever', (req, res) => {
	res.render('./../../web/views/account/receiver', {})
})


// Не сработало
router.get('/auth/vk', async (req, res) => {
	let code = req.query.code
	let reqToken = await axios.get(`https://oauth.vk.com/access_token?client_id=${config.vk.client_id}&client_secret=${config.vk.secret}&redirect_uri=${config.vk.redirect}&code=${code}`)

	let accessToken = reqToken.data.access_token
	let userId 		= reqToken.data.user_id

	let reqData = await axios.get(`https://api.vk.com/method/users.get?access_token=${accessToken}&&v=${config.vk.v}&&user_id=${userId}`)
	let user = reqData.data.response[0]

	let student = (await SQL('select * from student where socialId = ? and socialType = ?', [user.id, 4]))[0]

	if(student) {

		if(accessToken != student.socialToken) await SQL('update student set socialToken = ? where student_id = ?', [accessToken, student.student_id])
		await writeAction(`Студент ${student.firstname} ${student.lastname} вошел в SmartChat c VKONTAKTE`)
		res.cookie('SI', 	user.id, 				1, { maxAge: 900000, httpOnly: true })
		res.cookie('ST', 	4, 						2, { maxAge: 900000, httpOnly: true })
		res.cookie('STO', 	accessToken,			4, { maxAge: 900000, httpOnly: true })
		res.cookie('SAI', 	student.student_id, 	3, { maxAge: 900000, httpOnly: true })	
		res.redirect('/')

	} else {

		let newStudent = await SQL('insert into student(firstname, lastname, socialToken, socialId, socialType, smsOn, mailOn) values(?,?,?,?,4, 0, 0)', 
			[user.first_name, user.last_name, accessToken, user.id])

		if(newStudent.affectedRows > 0) {

		await writeAction(`Зарегестрирован студент ${user.first_name} ${user.last_name} через социальную сеть VKONTAKTE`)
		res.cookie('SI', 	user.id, 				1, { maxAge: 900000, httpOnly: true })
		res.cookie('ST', 	4, 						2, { maxAge: 900000, httpOnly: true })
		res.cookie('STO', 	accessToken,			4, { maxAge: 900000, httpOnly: true })
		res.cookie('SAI', 	newStudent.insertId, 	3, { maxAge: 900000, httpOnly: true })
		res.redirect('/')

		} else res.status(202).json({message: 'can\'t add you'})
	}
})

router.get('/auth/mail', async (req, res) => {

	let getToken = await request('https://connect.mail.ru/oauth/token', { 
		method: 'POST',
		data: {
			client_id: config.mail.client_id,
			client_secret: config.mail.secret,
			grant_type: 'authorization_code',
			code: req.query.code,
			redirect_uri: config.mail.redirect,
		}
	})

	let data = JSON.parse(getToken.body)

	let refreshToken 	= data.refresh_token
	let accessToken 	= data.access_token
	let uid 			= data.x_mailru_vid

	let sig = await md5(`app_id=${config.mail.client_id}method=users.getInfosecure=1session_key=${accessToken}${config.mail.secret}`)
	let userInfo = await request('http://www.appsmail.ru/platform/api', {
		method: 'POST',
		data: {
			app_id 			: config.mail.client_id,
			method			: 'users.getInfo',
			secure 			: 1,
			session_key 	: accessToken,
			sig
		}
	}) 

	data = JSON.parse(userInfo.body)[0]

	let student = (await SQL('select * from student where socialId = ? and socialType = ?', [uid, 2]))[0]

	if(student) {
		await writeAction(`Студент ${student.firstname} ${student.lastname} вошел в SmartChat c MAIL.RU`)
		if(refreshToken != student.socialToken) await SQL('update student set socialToken = ? where student_id = ?', [refreshToken, student.student_id])
		res.cookie('SI', 	uid, 					1, { maxAge: 900000, httpOnly: true })
		res.cookie('ST', 	2, 						2, { maxAge: 900000, httpOnly: true })
		res.cookie('STO', 	refreshToken,			4, { maxAge: 900000, httpOnly: true })
		res.cookie('SAI', 	student.student_id, 	3, { maxAge: 900000, httpOnly: true })
		res.redirect('/')

	} else {

		let birthday = data.birthday.split('.')
		birthday = `${birthday[2]}-${birthday[1]}-${birthday[0]}`

		let newStudent = await SQL('insert into student(firstname, lastname, ava, email, birthday, socialToken, socialId, socialType, smsOn) values(?,?,?,?,?,?,?,2, 0)', 
			[data.first_name, data.last_name, data.pic_big, data.email, birthday, refreshToken, uid])

		if(newStudent.affectedRows > 0) {

		await writeAction(`Зарегестрирован студент ${data.first_name} ${data.last_name} через социальную сеть MAIL.RU`)
		res.cookie('SI', 	uid, 					1, { maxAge: 900000, httpOnly: true })
		res.cookie('ST', 	2, 						2, { maxAge: 900000, httpOnly: true })
		res.cookie('STO', 	refreshToken,			4, { maxAge: 900000, httpOnly: true })
		res.cookie('SAI', 	newStudent.insertId, 	3, { maxAge: 900000, httpOnly: true })	
		res.redirect('/')

		} else res.status(202).json({message: 'can\'t add you'})
	}
})

module.exports = router;
