let router 			= require('express').Router()

let amoreg 		= require('../amocrm/amoreg')
let checkenter 	= require('../amocrm/checkenter')
let checktrial 	= require('../amocrm/checktrial')
let wasted 		= require('../amocrm/wasted')
let amomove 	= require('../amocrm/amomove')

router.post('/amoreg', amoreg)
router.post('/amocheckenter', checkenter)
router.post('/amochecktrial', checktrial)
router.post('/amowasted', wasted)
router.get('/amomove', amomove)

module.exports = router