module.exports = async (dateUTC) => 
{
	let dt = new Date(dateUTC);
	return `${dt.getUTCHours()<10?('0'+dt.getUTCHours()):dt.getUTCHours()}:${dt.getUTCMinutes()<10?('0'+dt.getUTCMinutes()):dt.getUTCMinutes()} ${dt.getUTCDate()<10?('0'+dt.getUTCDate()):dt.getUTCDate()}.${dt.getUTCMonth()+1<10?('0'+dt.getUTCMonth()+1):(dt.getUTCMonth()+1)}.${dt.getUTCFullYear()}`;
}