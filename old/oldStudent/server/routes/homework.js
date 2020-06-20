let controller = require('../controllers/homework')

module.exports = async function(req, res) {
	try {
		await startLog('homework', req.body);
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");
		let result = null;
		switch (req.body.method.toUpperCase()) {
			case 'GET': 		result = await controller.getHomeworks(req);			break;
			case 'CONTENT': 	result = await controller.getContent(req);				break;
			case 'UPLOAD': 		result = await controller.uploadFile(req);				break;
			default: 			res.status(404).json({ message: "NO SUCH METHOD!" });	break;		
		}
		await endLog('homework', result, req.body.myId);
		res.status(result.status).json(result)		
	} catch (err) {
		await endLog('homework::ERROR', { err: err.message, route: 'homework' }, req.body.myId);
		res.status(404).json({ "Error: ": err.message})
	}
} 