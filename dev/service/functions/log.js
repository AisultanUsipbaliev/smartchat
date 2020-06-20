let fs = require('fs')

module.exports = async function (action, data, danger) {
	let date 	= new Date()
	let message = `${date.getDate()}.${Number(date.getMonth()) + 1} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\t~ `
	message+= action 
	if(data) message+= JSON.stringify(data)

	await fs.appendFileSync( '../serviceLogs/cron.log', '\n' + message)

	if(danger) 
		await fs.appendFileSync( '../serviceLogs/error.log', '\n' + message)
}