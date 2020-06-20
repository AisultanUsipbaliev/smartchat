let model = require('../models/homework');

exports.getHomeworks = async function (req) {
	let result = await model.getHomeworks(req.body.myId);
	if(result.length>0) return { status: 200, body: result};
	else 				return { status: 202, message: 'empty'};
}

exports.getContent = async function (req) {
	if(!req.body.temp_id) 	return {status: 418, message: 'no temp_id'};
	let contents 	= await model.getContentsById(req.body.temp_id);
	let results 	= await model.getResult(req.body.myId, req.body.temp_id);
	if (contents.length>0) 	return {status: 200, body: contents, results};
	else 					return {status: 202, message: 'empty'};	
}

exports.uploadFile = async function (req) {
	let data = JSON.parse(req.body.data);

	if(!req.files.uploadFile)	return {status: 418, message: 'no uploadFile'};
	if(!data.template)			return {status: 418, message: 'no data.template'};

	let date = new Date();
	let filename = date.valueOf() + req.files.uploadFile.name;
	let fileData = req.files.uploadFile.data;

	let fs = require('fs');
	await fs.writeFileSync("./../../files/files/" + filename, fileData, 'binary');

	let result = await model.uploadFile(req.body.myId, data.template, filename);
	if (result) return {status: 200,message: 'success'}
	else 		return {status: 400,message: 'empty'}
}