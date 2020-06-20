let SQL = require('../database/query');

module.exports = async function(req, res) {
	try {
		await startLog('uploadPhoto', {});
		let fileData = req.files.uploadFile.data;
		let date = new Date();
		let name = 's'+ req.body.myId + date.valueOf() + '.png';
		let fs = require('fs');
		await fs.writeFileSync("./../../files/photo/" + name, fileData, 'binary');

		await SQL('update student set ava = ? where student_id =?', [name, req.body.myId])

		await endLog('uploadPhoto', name, req.body.myId);
		res.status(200).json(name);
	} catch(err) {
		await endLog('uploadPhoto', { err: err.message, route: 'uploadPhoto' }, req.body.myId); 
		res.status(202).json({message: 'Ошибка сервера!'});
	}
} 