const SQL = require('../database/query');

exports.getHomeworks = async function(student_id)
{
	return await SQL(`	SELECT h.id, h.template, h.checked, h.score, h.filepath, h.dt, c.content,
						r.rate_name, r.rate_id 
						FROM student as s
						JOIN homework as h on h.student = s.student_id
						JOIN template as t on t.temp_id = h.template
						JOIN rate as r on r.rate_id = t.rate_id
						LEFT JOIN content c on c.temp_id = h.template and c.type = 1
						WHERE s.student_id = ?
						order by h.dt desc`, [student_id]);	
}

exports.getResult = async function(id, temp_id)
{
	return (await SQL('select * from homework where student = ? and template = ?', [id, temp_id] ))[0];
}

exports.getContentsById = async function(id) 
{
	return await SQL(`
		SELECT cont_id, type, content 
		FROM content
		WHERE temp_id = ?`, id);
}

exports.uploadFile = async function (studId, template, filepath)
{
	let id = (await SQL('select id from homework where student = ? and template = ?', [studId, template]))[0].id;
	console.log(filepath);
	let result = await SQL('UPDATE homework SET filePath = ?, done = 1 WHERE id = ?', [filepath + '', id]);
	if(result.affectedRows > 0) return true;
	else 						return false;
}