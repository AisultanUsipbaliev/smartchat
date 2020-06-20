let fs = require('fs')

exports.startLog = async function(route, data, flag) {
	let date = new Date()
	let time = `${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()} ${date.getDate()}/${Number(date.getMonth())+1}/${date.getFullYear()}`
	await fs.appendFileSync( './api.log', `\n\n\n-----------------------${time}-------------------------\n`)
	await fs.appendFileSync( './api.log', '\n' + route + '|DATA|' + JSON.stringify(data))	
	if (flag) {
		console.log('---------------------------------------------------------------------------')
		console.log(route + '::Data::' , data);
	}
}

exports.endLog = async function(route, data, flag) {
	let date = new Date()
	let time = `${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()} ${date.getDate()}/${Number(date.getMonth())+1}/${date.getFullYear()}`
	
	await fs.appendFileSync( './api.log', '\n' + route + '|ANSWER|' + JSON.stringify(data))
	await fs.appendFileSync( './api.log', `\n\n-----------------------${time}-------------------------`)

	if (flag) {
		console.log(route + '::Answer::' , data);	
		console.log('---------------------------------------------------------------------------')
	}
}

exports.errorLog = async function(route, data, err) {
	console.log('**********************************************')
	console.log('route: /' + route)
	console.log(data)
	console.log(err)
	console.log('**********************************************')

	let text = JSON.stringify(data) + ' | ' + err + ''
	await endLog('teacher::ERROR', text);
	await sayMe('teacher::ERROR', text)
}