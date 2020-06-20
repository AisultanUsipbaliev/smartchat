let fs 		= require('fs')
let path 	= require('../path')

module.exports = async function(req) {
	if(!req.files) 				return {status: 418, message: 'no files'}
	if(!req.files.uploadFile)	return {status: 418, message: 'no uploadFile'}

	let name = ''
	let mas = req.files.uploadFile.name.split('.')
	for(let i=0; i<mas.length-1; i++)
		name += mas[i]
	let ext = mas[mas.length-1]
	
	if(req.files.uploadFile.name == 'blob') ext = 'wav'
	
	if(ext == 'js') 	return { status: 400, message: 'fuck off!' }
	if(ext == 'html') 	return { status: 400, message: 'fuck off!' }

	let fileData = req.files.uploadFile.data
	name = req.body.name? req.body.name : name + (new Date()).valueOf() + '.' + ext
	
	await fs.writeFileSync(path.files + name, fileData, 'binary')
	return {status: 200, name}	
}