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


// data:
//    { Model:
//       { PublicId: 'pk_eaff98b9708d86599925646c1e73c',
//         TransactionId: 86272153,
//         Amount: 5000,
//         Currency: 'KZT',
//         CurrencyCode: 4,
//         PaymentAmount: 5000,
//         PaymentCurrency: 'KZT',
//         PaymentCurrencyCode: 4,
//         InvoiceId: '43lQwhIhjgi9fJM',
//         AccountId: null,
//         Email: null,
//         Description: 'Индивидуальный',
//         JsonData: null,
//         CreatedDate: '/Date(1542274835356)/',
//         PayoutDate: '/Date(1542315600000)/',
//         PayoutDateIso: '2018-11-15T21:00:00',
//         PayoutAmount: 4805,
//         CreatedDateIso: '2018-11-15T09:40:35',
//         AuthDate: '/Date(1542274841036)/',
//         AuthDateIso: '2018-11-15T09:40:41',
//         ConfirmDate: '/Date(1542274854303)/',
//         ConfirmDateIso: '2018-11-15T09:40:54',
//         AuthCode: '866297',
//         TestMode: false,
//         Rrn: '831981508642@81BDE9FFAAD7AC8B',
//         OriginalTransactionId: null,
//         IpAddress: '5.188.67.224',
//         IpCountry: 'RU',
//         IpCity: 'Санкт-Петербург',
//         IpRegion: null,
//         IpDistrict: 'Санкт-Петербург',
//         IpLatitude: 59.93863,
//         IpLongitude: 30.31413,
//         CardFirstSix: '516949',
//         CardLastFour: '1272',
//         CardExpDate: '07/21',
//         CardType: 'MasterCard',
//         CardProduct: null,
//         CardCategory: '',
//         IssuerBankCountry: 'KZ',
//         Issuer: 'JSC KASPI BANK',
//         CardTypeCode: 1,
//         Status: 'Completed',
//         StatusCode: 3,
//         CultureName: 'kk',
//         Reason: 'Approved',
//         CardHolderMessage: 'Оплата успешно проведена',
//         Type: 0,
//         Refunded: false,
//         Name: 'ANASTASSIYA GONCHARENKO',
//         Token: 'tk_715f4c53c9b17ed1389b46ae0a92d',
//         SubscriptionId: null,
//         GatewayName: 'Sber KZ',
//         ApplePay: false,
//         AndroidPay: false,
//         ReasonCode: 0 }