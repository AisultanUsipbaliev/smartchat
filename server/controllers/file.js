exports.SendFile = async function(req)
{
	console.log(req.files);

    let fileData = req.files.uploadFile.data;

    let date = new Date();
    let path = date.valueOf() + req.files.uploadFile.name;
    
    let config = require('../config');
    let fs = require('fs');

    if(fs.existsSync("./static/files/" + path)) 
    {
    //если загружаемый файл существует удаляем его
        fs.unlinkSync("./static/files/" + path);
    }

    await fs.writeFileSync("./static/files/" + path, fileData, 'binary');

    return {status: 200, file: path};

}
exports.UploadPicture = async function(req)
{
	console.log(req.files);

	let fileData = req.files.uploadFile.data;

	let path = './static/profilePictures/' + req.session.id + '.png';

	let fs = require('fs');

	if(fs.existsSync(path)) await fs.unlinkSync(path);

	await fs.writeFileSync(path, fileData, 'binary');
	await model.UpdateAva({path, index: req.session.index});

	res.send(req.session.name + '.png');
}
