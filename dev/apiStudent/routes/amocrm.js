let router 			= require('express').Router()

let amoreg 		= require('../amocrm/amoreg')
let checkenter 	= require('../amocrm/checkenter')
let checktrial 	= require('../amocrm/checktrial')

router.post('/amoreg', 			amoreg)
router.post('/amocheckenter', 	checkenter)
router.post('/amochecktrial', 	checktrial)

module.exports = router