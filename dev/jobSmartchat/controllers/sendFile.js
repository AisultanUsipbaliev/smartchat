let fs = require('fs')

module.exports = async (req, res) => {

	try {

		if(!req.files) 				return res.sendStatus(418)
		if(!req.files.uploadFile)	return res.sendStatus(418)

		let name = ''
		let mas = req.files.uploadFile.name.split('.')

		for(let i=0; i<mas.length-1; i++) name += mas[i]

		let ext = mas[mas.length-1]

		if(req.files.uploadFile.name == 'blob') ext = 'wav'	
		if(ext == 'js') 	return res.sendStatus(400)
		if(ext == 'html') 	return res.sendStatus(400)

		let fileData = req.files.uploadFile.data
		name = req.body.name? req.body.name : name + (new Date()).valueOf() + '.' + ext
		
		await fs.writeFileSync('../files/files/' + name, fileData, 'binary')
		res.status(200).json({name})

	} catch(err) {
		console.error(err)
		sayMe('jobSmartchat/sendFile', {}, err.message)
		res.sendStatus(405)
	}
}