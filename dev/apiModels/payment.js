let SQL = require('../apiFunctions/query')

// Проверка данных
	exports.invoiceIsOk = async (invoiceId) => {
		return (await SQL('select * from payment where invoiceId = ?', invoiceId)).length == 0
	}
	exports.getBilling = async (column, order, from, limit, text, start, end) => {
		if (start && end) {
			return await SQL(`	select s.student_id, concat(s.firstname, ' ', s.lastname) as fio, concat(p.amount, p.currency) as amount, date_format(p.dt,'%d.%m.%Y %T') as dt from payment p
								left join student s on p.student = s.student_id
								where concat(s.firstname, ' ', s.lastname) like concat('%', ? ,'%')
								and p.dt >= ? and p.dt <= ?
								order by ? ${order} limit ?, ?`, [text,start,end,column,from,limit]);	
		} else {
			return await SQL(`	select s.student_id, concat(s.firstname, ' ', s.lastname) as fio, concat(p.amount, p.currency) as amount, date_format(p.dt,'%d.%m.%Y %T') as dt from payment p
								left join student s on p.student = s.student_id
								where concat(s.firstname, ' ', s.lastname) like concat('%', ? ,'%')
								order by ? ${order} limit ?, ?`, [text,column,from,limit]);	
		}
	}
	exports.getAll = async (start, end) => {
		let result = (start && end) ? (await SQL('select sum(p.amount) as amount, count(p.id) as length from payment p where p.dt >= ? and p.dt <= ?', [start, end]))
									: (await SQL('select sum(p.amount) as amount, count(p.id) as length from payment p'))
		return result
	}
// Выборка
	
// Вставка
	exports.addPayment = async (transaction, amount, currency, invoiceId, ip, status, code, message, name, student, dt) => {
		return (await SQL('insert into payment(transaction, amount, currency, invoiceId, ip, status, code, message, name, student, dt) values (?,?,?,?,?,?,?,?,?,?,?,?,?)', 
			[transaction, amount, currency, invoiceId, ip, status, code, message, name, student, dt])).affectedRows
	}
// Удаление
	
// Изменение 

