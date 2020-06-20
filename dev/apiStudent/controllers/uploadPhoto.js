let fs = require('fs')
let path = require('../path')
let studentModel = require('../../apiModels/student')

module.exports = async function(req) {
	if(!req.files) 				return {status: 418, message: 'no files'}
	if(!req.files.uploadFile)	return {status: 418, message: 'no uploadFile'}

	let fileData = req.files.uploadFile.data
	let name = 's'+ req.body.myId + (new Date()).valueOf() + '.png';

	await studentModel.updatePhoto(req.body.myId, name)
	await fs.writeFileSync(path.photo + name, fileData, 'binary')

	return {status: 200, name}	
}