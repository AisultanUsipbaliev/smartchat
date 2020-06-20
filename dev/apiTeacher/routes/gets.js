let router 		= require('express').Router()
let path 		= require('../path')

let teacherModel = require('../../apiModels/teacher')

router.get('/login', (req, res) => { res.render(path.login, {}) })
router.get('/restore', async (req, res) => { res.render(path.restore, {}) })
router.get('/activate', async (req, res) => { res.render(path.activate, {}) })
router.get('/registration', async (req, res) => { res.render(path.registration, {}) })

router.get('/emailActivated', async (req, res) => { res.render(path.emailActivated, {}) } )
router.get('/outdated', async (req, res) => { res.render(path.outdated, {}) } )


router.get('/activateEmail', async (req, res) => {
	await teacherModel.activateEmail(req.query.code)? res.render(path.emailActivated, {}) : res.render(path.outdated, {})
})

module.exports = router