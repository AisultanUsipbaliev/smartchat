let SQL = require('../functions/query')

// Проверка данных
	exports.invoiceIsOk = async function(invoiceId) {
		return (await SQL('select * from payment where invoiceId = ?', invoiceId)).length > 0? false: true
	}
// Выборка
	
// Вставка
	exports.addPayment = async function(transaction, amount, currency, invoiceId, ip, cardFirst, cardLast, cartType, status, code, message, name, student) {
		return (await SQL('insert into payment(transaction, amount, currency, invoiceId, ip, cardFirst, cardLast, cardType, status, code, message, name, student) values (?,?,?,?,?,?,?,?,?,?,?,?,?)', 
			[transaction, amount, currency, invoiceId, ip, cardFirst, cardLast, cartType, status, code, message, name, student])).affectedRows > 0? true:false;
	}
// Удаление
	
// Изменение