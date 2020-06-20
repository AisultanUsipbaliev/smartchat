let getDeal 	= require('./getDeal')
let amoRequest 	= require('./amoRequest')

module.exports = async function(dealId, stage, prevStage) {
	let deal = await amocrmModel.getDeal(dealId)

	if(deal.stage == prevStage) {
		deal = await getDeal(dealId)
		try {
			await amoRequest('https://start1t.amocrm.ru/api/v2/leads/', 'POST', { update: [{
				id: deal.dealId,
				updated_at: deal.updated,
				status_id: stage
			}]})
			return true
		} catch(ex) {
			console.log(ex)
			sayMe('apiFunctions/updateDealStage', {dealId, stage, prevStage}, ex.message)
 			return false
		}
		
	}

	sayMe('apiFunctions/updateDealStage', {dealId, stage, prevStage},'')
	return false
}