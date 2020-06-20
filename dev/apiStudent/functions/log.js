let fs = require('fs')
exports.startLog = async function(name, data, flag) {
	if(flag) {
		console.log(`---------------------*${await getTime()}*------------------`)
		console.log(`ROUTER::${name}::DATA::`, data)
	}

	await startWrite(data.myId, name, data)
}

exports.endLog = async function(name, data, myId, flag) {


	if(data.err) await sayMe(data.route, data.data, data.err + '')
	
	if(flag) {
		console.log(`ROUTER::${name}::ANSWER::`)
		console.log(data)
		console.log('********************************************************************************')
		console.log()
	}

	await endWrite(myId, name, data)
}

async function startWrite(myId, name, data) {
	
	let file = `../studentLogs/${myId}.log`
	
	if(!( fs.existsSync(file))) fs.writeFileSync(file, '', 'binary')
	
	fs.appendFileSync(file, '\n')
	fs.appendFileSync(file, '\n---------------------------------------------------------------------')
	fs.appendFileSync(file, `\n----------------------${await getTime()}----------------------`)
	fs.appendFileSync(file, `\n${name}||DATA||${JSON.stringify(data)}`)

}

async function endWrite(myId, name, data) {
	let file = `../studentLogs/${myId}.log`

	if(!(fs.existsSync(file))) fs.writeFileSync(file, '', 'binary')

	fs.appendFileSync(file, `\n${name}||ANSWER||${JSON.stringify(data)}`)
	fs.appendFileSync(file, `\n----------------------${await getTime()}----------------------`)
	fs.appendFileSync(file, '\n---------------------------------------------------------------------')
	fs.appendFileSync(file, '\n')
}

function getTime() {
	let date = new Date()
	let time = `${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()} ${date.getDate()}/${Number(date.getMonth())+1}/${date.getFullYear()}`
	return time
}