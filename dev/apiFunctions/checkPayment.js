let axios = require('axios')

module.exports = async function(invoiceId) {
	let res = await axios('https://api.cloudpayments.kz/payments/find',{
		method: 'POST',
		data : {
			InvoiceId: invoiceId
		},
		headers : {
			'Content-Type': 'application/json'
		},
		auth : config.cloudpayments
	})

	return {
		transaction 	: res.data.Model.TransactionId, 
		amount 			: res.data.Model.Amount,
		currency 		: res.data.Model.Currency,
		invoiceId 		: res.data.Model.InvoiceId,
		ip 				: res.data.Model.IpAddress,
		cardFirst 		: res.data.Model.CardFirstSix,
		cardLast 		: res.data.Model.CardLastFour,
		cardType 		: res.data.Model.CardType,
		status 			: res.data.Model.Status,
		code 			: res.data.Model.StatusCode,
		message 		: res.data.Model.CardHolderMessage,
		name 			: res.data.Model.Name
	}
}