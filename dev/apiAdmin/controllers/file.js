let fs = require('fs');

exports.uploadFile = async (req) =>{
	if(req.files && req.files.uploadFile){
		let fileData = req.files.uploadFile.data;
		let name = req.body.fileName;
		await fs.writeFileSync('./../files/files/' + name, fileData, 'binary')
		return { status: 200 }
	} else return { status: 418 }
}