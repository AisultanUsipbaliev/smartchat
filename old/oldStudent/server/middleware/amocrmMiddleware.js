let studentModel = require('../model/student')
let amocrmModel  = require('../model/amocrm')
let trialModel = require('../model/trial')

let updateDealStage = require('../amocrm/updateDealStage')

module.exports = async function(req, res, next) {

	let deal = await amocrmModel.getStudentDeal(req.body.myId)

	if(deal) {

		if(deal.stage == config.amocrm.checkEnter) 
			await updateDealStage(deal.dealId, config.amocrm.checkTrial, config.amocrm.checkEnter)
		

		let trials = await trialModel.getMyTrial(req.body.myId)
		if(trials.length && deal.stage == config.amocrm.checkTrial) 
			await updateDealStage(deal.dealId, config.amocrm.hasTrial, config.amocrm.checkTrial)
		
		
	}

	next()
}