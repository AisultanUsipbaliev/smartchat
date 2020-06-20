let SQL = require('../functions/query')

// Проверка данных
	exports.invoiceIsOk = async function(invoiceId) {
		return (await SQL('select * from payment where invoiceId = ?', invoiceId)).length == 0
	}
// Выборка
	
// Вставка
	exports.addPayment = async function(transaction, amount, currency, invoiceId, ip, status, code, message, name, student, dt) {
		return (await SQL('insert into payment(transaction, amount, currency, invoiceId, ip, status, code, message, name, student, dt) values (?,?,?,?,?,?,?,?,?,?,?,?,?)', 
			[transaction, amount, currency, invoiceId, ip, status, code, message, name, student, dt])).affectedRows > 0
	}
// Удаление
	
// Изменение