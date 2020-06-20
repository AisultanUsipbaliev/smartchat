module.exports = async (ref, dateUTC) => 
{
	let dt = new Date(dateUTC);
	let result = new Date(dt.valueOf()+(ref*60*60*1000));
	return result;
}