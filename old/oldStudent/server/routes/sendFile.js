module.exports = async function(req, res) {
	try {
		await startLog('sendFile', { myId: req.body.myId, file: req.body.name });

		console.log(req.files.uploadFile)

		let fileData = req.files.uploadFile.data;
		let date = new Date();
		let name = date.valueOf();
		
		if(req.body.name) 	name += req.body.name;
		else 				name += req.files.uploadFile.name;

		let fs = require('fs');
		await fs.writeFileSync("./../../files/files/" + name, fileData, 'binary');
		await endLog('sendFile', name, req.body.myId);
		res.status(200).json(name);
	} catch(err) {
		await endLog('sendFile', { err: err.message, route: 'sendFile' }, req.body.myId);
		res.status(202).json({message: 'Ошибка сервера!'});
	}
}