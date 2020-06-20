const SQL = require('../functions/query');

exports.getSystemMessages = async () =>
{
	return await SQL(`select * from mail`);
}
exports.updateSystemMessages = async (id, message, comment) =>
{
	return (await SQL('update mail set message = ?, comment = ? where id = ?', [message, comment, id])).affectedRows > 0 ? true: false;
}