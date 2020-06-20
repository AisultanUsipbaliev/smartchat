const model = require('../models/system_messages');

exports.GetSystemMessages = async () => 
{
	let messages  = await model.getSystemMessages(); 
	return messages.length ? { status: 200, messages } : { status: 204 };
}
exports.UpdateSystemMessage = async (req) =>
{
	if (!req.body.id) 		{ return { status: 400, message: 'no id' }; }

	let result = await model.updateSystemMessages(req.body.id, req.body.message, req.body.comment);

	return result ? { status: 200 } : { status: 204 } 
}
