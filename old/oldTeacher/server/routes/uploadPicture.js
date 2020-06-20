let fs = require('fs');
let SQL = require('../modules/query');

module.exports = async function(req, res) {
	try {
		startLog('uplodaPicture', {body: req.body, index: req.cookies.SAI});
		let fileData = req.files.uploadFile.data;
		let date = new Date();
		let name = 't'+ req.cookies.SAI + '.png';
		let fs = require('fs');
		await fs.writeFileSync("./../../files/photo/" + name, fileData, 'binary');
		await SQL('update teacher set ava = ? where teacher_id = ?', [name, req.cookies['SAI']]);
		endLog('uploadPicture', {name})
		res.status(200).json(name);
	}
	catch(err) {
		await errorLog('uploadPicture', {body: req.body, index: req.cookies.SAI}, err)
		res.status(202).json({message: 'Ошибка сервера!'});
	}
} 