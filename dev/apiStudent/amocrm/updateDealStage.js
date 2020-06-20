let amoRequest 	= require('../functions/amoPost')
let amocrmModel = require('../../apiModels/amocrm')
let getDeal 	= require('./getDeal')

module.exports = async function(dealId, stage, prevStage) {

	let deal = await amocrmModel.getDeal(dealId)

	if(deal.stage == prevStage) {

		deal = await getDeal(dealId)

		let statusRequest = await amoRequest('https://start1t.amocrm.ru/api/v2/leads/', 'POST', { update: [{
			id: deal.dealId,
			updated_at: deal.updated,
			status_id: stage
		}]})

		let statusBody = JSON.parse(statusRequest.body)

		await amocrmModel.updateStage(dealId, stage)
		await amocrmModel.updateDate(dealId, statusBody._embedded.items[0].updated_at)

		return true
	}

	sayMe('Сделка не подвинута', `Номер сделки: ${dealId}\nХотел поставить стадию: ${stage}\nБыла стадия: ${prevStage}`)
	return false
}