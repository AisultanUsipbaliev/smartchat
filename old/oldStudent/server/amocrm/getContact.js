let amoRequest 	= require('../functions/amoPost')

module.exports = async function(contactId) {

	let contactResponse = await amoRequest('https://start1t.amocrm.ru/api/v2/contacts/?id='+contactId, 'GET')
	let contactBody = JSON.parse(contactResponse.body)

	let firstname = contactBody._embedded.items[0].name
	let phone = contactBody._embedded.items[0].custom_fields[0].values[0].value
	let email = contactBody._embedded.items[0].custom_fields[1]? 
		contactBody._embedded.items[0].custom_fields[1].values[0].value : null

	return {
		firstname,
		phone,
		email
	}
}