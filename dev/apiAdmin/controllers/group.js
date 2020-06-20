const groupModel = require('../../apiModels/group');

exports.updateTeacher = async (req) => {
	if (!req.body.group_id) 		{ return { status: 400, message: 'no group_id' } }
	if (!req.body.teacher_id) 		{ return { status: 400, message: 'no teacher_id' } }

	let result = await groupModel.updateTeacher(req.body.group_id, req.body.teacher_id);

	return result ? { status: 200 } : { status: 204 };
}
exports.updateRate = async (req) => {
	if (!req.body.group_id) { return { status: 400, message: 'no group_id' } }
	if (!req.body.rate_id) 	{ return { status: 400, message: 'no rate_id' } }

	let result = await groupModel.updateRate(req.body.group_id, req.body.rate_id);

	return result ? { status: 200 } : { status: 204 };
}

