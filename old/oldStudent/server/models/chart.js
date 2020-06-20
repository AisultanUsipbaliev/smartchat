const SQL = require('../database/query');

exports.getChart = async function(student_id, start, finish) {
	return await SQL(`	SELECT g.group_type, r.rate_name, g.group_id, 
						c.start, c.finish, l.lvl_name
						FROM student AS s 
						JOIN gr AS g ON s.group_id = g.group_id
						JOIN chart AS c ON g.group_id = c.group_id
						JOIN rate AS r ON r.rate_id = g.rate_id
						JOIN lvl AS l ON l.lvl_id = s.lvl
						WHERE s.student_id = ?
						AND ((c.start >= ? and c.start <= ?) or (c.finish >= ? and c.finish <= ?))`, 
						[student_id, start, finish, start, finish]);
}