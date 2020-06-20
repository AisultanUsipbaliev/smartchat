const SQL = require('../functions/query');

exports.getBilling = async (column, order, from, limit, text, start, end) =>
{
	return await SQL(`select s.student_id, concat(s.firstname, ' ', s.lastname) as fio, concat(p.amount, p.currency) as amount, date_format(p.dt,'%d.%m.%Y %T') as dt from payment p
										left join student s on p.student = s.student_id
										where concat(s.firstname, ' ', s.lastname) like concat('%', ? ,'%')
										${start ? 'and p.dt >= ' + start + ' and p.dt <= ' + end : ''}
										order by ? ${order} limit ?, ?`, [text,column,from,limit]);	
}

exports.getAll = async (start, end) =>
{
	return await SQL(`select sum(p.amount) as amount, count(p.id) as length from payment p
										${start ? 'where p.dt >= ? and p.dt <= ?' : ''}
										`, [start, end]);
}
