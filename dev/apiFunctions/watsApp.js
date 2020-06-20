let request = require('async-request')

module.exports = async (phone, text) => {

	let id = null
	phone = phone.replace('+', '')

	let res = await request('https://api.chat2desk.com/v1/clients', {
		headers: {
			Authorization: config.watsAppToken
		}
	})

	let body = JSON.parse(res.body)
	let contacts = body.data

	for(i=0; i<contacts.length; i++) 
		if( contacts[i].phone == phone ) id = contacts[i].id 
		
	if(!id) { 

		res = await request('https://api.chat2desk.com/v1/clients', {
			method: 'POST',
			data: {
				phone,
				transport: 'whatsapp'
			},
			headers: {
				Authorization: config.watsAppToken
			}
		})

		body = JSON.parse(res.body)
		let contact = body.data
		id = contact.id

	} 

	res = await request('https://api.chat2desk.com/v1/messages', { 
		method: 'POST',
		data: {
			client_id: id,
			text,
			transport: 'whatsapp'
		},
		headers: {
			Authorization: config.watsAppToken
		}
	}) 

	return res.status == 200? 1:0 
}