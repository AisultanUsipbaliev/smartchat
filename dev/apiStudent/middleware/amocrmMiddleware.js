let studentModel = require('../../apiModels/student')
let amocrmModel  = require('../../apiModels/amocrm')
let trialModel = require('../../apiModels/trial')

let updateDealStage = require('../amocrm/updateDealStage')

module.exports = async function(req, res, next) {

	let deal = await amocrmModel.getStudentDeal(req.body.myId)

	if(deal) {

		if(deal.stage == config.amocrm.checkEnter) 
			await updateDealStage(deal.dealId, config.amocrm.checkTrial, config.amocrm.checkEnter)
		

		let trials = await trialModel.getTrial(req.body.myId)
		if(trials.length && deal.stage == config.amocrm.checkTrial) 
			await updateDealStage(deal.dealId, config.amocrm.hasTrial, config.amocrm.checkTrial)
		
		
	}

	next()
}