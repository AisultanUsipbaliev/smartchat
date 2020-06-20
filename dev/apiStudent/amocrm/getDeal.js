let amoRequest 	= require('../functions/amoPost')
let amocrmModel = require('../../apiModels/amocrm')

module.exports = async function(dealId) {
	let dealResponse = await amoRequest('https://start1t.amocrm.ru/api/v2/leads?id=' + dealId, 'GET')
	let dealBody = JSON.parse(dealResponse.body)

	await amocrmModel.updateDate(dealId, dealBody._embedded.items[0].updated_at)

	return {
		dealId,
		contactId: dealBody._embedded.items[0].contacts.id[0],
		updated: dealBody._embedded.items[0].updated_at
	}
}