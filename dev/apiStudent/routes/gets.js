let md5 		= require('md5')
let axios 		= require('axios')
let request 	= require("async-request")
let router 		= require('express').Router()

let path = require('../path')
let translate 	= require("../translator")

let studentModel 	= require('../../apiModels/student')
let ingressModel	= require('../../apiModels/ingress')


// router.get('/anvar',   		async (req, res) => 	{ res.render(path.newpass, 			{version: config.version, strings: await translate('restore', 		req.cookies.SAL)})})
router.get('/reciever',   	async (req, res) => 	{ res.render(path.reciever, 		{version: config.version})})
router.get('/login', 	 	async (req, res) => 	{ res.render(path.login, 			{version: config.version, strings: await translate('login', 		req.cookies.SAL)}); })
router.get('/restore', 	  	async (req, res) => 	{ res.render(path.restore, 			{version: config.version, strings: await translate('restore', 		req.cookies.SAL)}); })
router.get('/activate',   	async (req, res) => 	{ res.render(path.activate, 		{version: config.version, strings: await translate('activate', 		req.cookies.SAL)}); })
router.get('/registration', async (req, res) => 	{ res.render(path.registration, 	{version: config.version, strings: await translate('registration', 	req.cookies.SAL)}); })

router.get('/activateEmail', async (req, res)=> {

	if(await studentModel.checkEmailCode(req.query.code)) {
		res.render(path.emailActivated, {version: config.version}) //Активировал
	} else {
		res.clearCookie('SAP')
		res.clearCookie('SAI')
		res.clearCookie('SAU')
		res.render(path.emailUnActivated, {version: config.version})
	}
})

// Эти снизу не отдают страницы - redirect делают

	router.get('/guide', async (req, res) => {
		let code = req.query.code
		if(!code) return res.redirect(`${config.hostname}/login`)

		let page = 'chat'
		switch(code[code.length-1]) {
			case 1: page = 'profile'; break;
			case 2: page = 'courses'; break; 
		}
		
		let student = await studentModel.findGuide(code)
		if(!student) return res.redirect(`${config.hostname}/login`)
		await studentModel.useGuide(student.student_id)

		await writeAction(`Студент ${student.firstname} ${student.lastname} прошел по ссылке на страницу ${page}`)
		writeIngress(req, student.student_id)

		if(!student.socialId) {
			res.cookie('SAU', student.phone, 			{ maxAge: 31104000000 })
			res.cookie('SAP', student.pass, 			{ maxAge: 31104000000 })
			res.cookie('SAI', student.student_id, 		{ maxAge: 31104000000 })
			res.redirect(`${config.hostname}/${page}`)
		} else {
			res.cookie('SI', 	student.socialId, 		{ maxAge: 31104000000 })
			res.cookie('ST', 	student.socialType, 	{ maxAge: 31104000000 })
			res.cookie('STO', 	student.socialToken,	{ maxAge: 31104000000 })
			res.cookie('SAI', 	student.student_id, 	{ maxAge: 31104000000 })
			res.redirect(`${config.hostname}/${page}`)
		}
		console.log('guide completed')
	})

	router.get('/auth/vk', async (req, res) => {
		let code = req.query.code
		let reqToken = await axios.get(`https://oauth.vk.com/access_token?client_id=${config.vk.client_id}&client_secret=${config.vk.secret}&redirect_uri=${config.vk.redirect}&code=${code}`)

		let accessToken = reqToken.data.access_token
		let userId 		= reqToken.data.user_id

		let reqData = await axios.get(`https://api.vk.com/method/users.get?access_token=${accessToken}&&v=${config.vk.v}&&user_id=${userId}`)
		let user = reqData.data.response[0]

		let student = await studentModel.findSocial2(user.id, 4,)

		if(student) {
			await writeAction(`Выполнена авторизация студента ${student.firstname} ${student.lastname} с соц. сети VKONTAKTE`)
			writeIngress(req, student.student_id)
			res.cookie('SI', 	user.id, 				{ maxAge: 31104000000 })
			res.cookie('ST', 	4, 						{ maxAge: 31104000000 })
			res.cookie('STO', 	student.socialToken,	{ maxAge: 31104000000 })
			res.cookie('SAI', 	student.student_id, 	{ maxAge: 31104000000 })	
			res.redirect('/')

		} else {

			let newStudent = await studentModel.addSocial(user.first_name, user.last_name, user.id, accessToken, 4)

			if(newStudent) {

				await writeAction(`Зарегестрирован студент ${user.first_name} ${user.last_name} через социальную сеть VKONTAKTE`)
				writeIngress(req, newStudent)
				res.cookie('SI', 	user.id, 				{ maxAge: 31104000000 })
				res.cookie('ST', 	4, 						{ maxAge: 31104000000 })
				res.cookie('STO', 	accessToken,			{ maxAge: 31104000000 })
				res.cookie('SAI', 	newStudent, 			{ maxAge: 31104000000 })
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

		let student = await studentModel.findSocial(uid, 2, refreshToken)
		if(student) {

			await writeAction(`Выполнена авторизация студента ${student.firstname} ${student.lastname} с соц. сети MAIL.RU`)
			writeIngress(req, student.student_id)
			res.cookie('SI', 	uid, 					{ maxAge: 31104000000 })
			res.cookie('ST', 	2, 						{ maxAge: 31104000000 })
			res.cookie('STO', 	refreshToken,			{ maxAge: 31104000000 })
			res.cookie('SAI', 	student.student_id, 	{ maxAge: 31104000000 })
			res.redirect('/')

		} else {

			let birthday = data.birthday.split('.')
			birthday = `${birthday[2]}-${birthday[1]}-${birthday[0]}`

			let newStudent = await studentModel.addSocial(data.first_name, data.last_name, uid, refreshToken, 2)

			if(newStudent) {
				
				await studentModel.updatePhoto(newStudent, data.pic_big)
				await studentModel.updateProfile(newStudent, data.first_name, data.last_name, birthday, data.email)
				await studentModel.activateEmail(newStudent)

				await writeAction(`Зарегестрирован студент ${data.first_name} ${data.last_name} через социальную сеть MAIL.RU`)
				writeIngress(req, newStudent)
				res.cookie('SI', 	uid, 					{ maxAge: 31104000000 })
				res.cookie('ST', 	2, 						{ maxAge: 31104000000 })
				res.cookie('STO', 	refreshToken,			{ maxAge: 31104000000 })
				res.cookie('SAI', 	newStudent, 	{ maxAge: 31104000000 })	
				res.redirect('/')

			} else res.status(202).json({message: 'can\'t add you'})
		}
	})

async function writeIngress(req, id) {
	
	let getIP 	= require('request-ip').getClientIp
	let ip 		= await getIP(req)
	let agent 	= req.headers['user-agent']

	await ingressModel.add(0, id, ip, agent)

}

module.exports = router