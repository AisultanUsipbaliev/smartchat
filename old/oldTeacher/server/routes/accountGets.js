let router 	= require('express').Router()
let SQL 	= require('../modules/query')

	router.get('/activateEmail', async (req, res)=> {
		let result = await SQL('update teacher set activated = 1 where emailCode = ?', req.query.code)
		if(result.affectedRows > 0) res.render('./../../views/account/activated', {version: config.version}) //Активировал
		else {
			res.clearCookie('SAP')
			res.clearCookie('SAI')
			res.clearCookie('SAT')
			res.clearCookie('SAN') 
			res.render('./../../views/account/outdated', {version: config.version}) //Не активировал
		}
	})

	router.get('/activate', (req, res)=> {
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version})
			else res.render('./../../views/account/notactivated', {version: config.version})
		})

	router.get('/login', function(req,res) {
			res.render('./../../views/account/login',{version: config.version})
		})

	router.get('/registration', function(req,res) {
			res.render('./../../views/account/registration',{version: config.version})
		})

module.exports = router