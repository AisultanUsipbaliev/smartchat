let controller = require('../controllers/req');

module.exports = async function(req,res) {
	try {
		startLog('req', {body: req.body, index: req.cookies.SAI});
		let result = false; 
		if(!req.body.method)  result = { status: 405, message: 'no method provided' };

		if(!result) switch(req.body.method) {
			case 'GET': 		result = await controller.get(req);					break;
			case 'GET-GRAPH': 	result = await controller.getGraph(req); 			break;
			case 'REJECT': 		result = await controller.reject(req);				break;
			case 'GET-GROUPS': 	result = await controller.getGroups(req);			break;
			case 'TAKE-IN':		result = await controller.addStudent(req);			break;
			case 'TAKE-ON':  	result = await controller.createGroup(req);			break;
			default: 			result = {status: 405, message: 'Invalid method'};	break;
		}
		endLog('req', result);
		res.status(result.status).json(result);
	}
	catch(err) {
		await errorLog('req', {body: req.body, index: req.cookies.SAI}, err)
		res.status(404).json({message: 'Server ERROR'});
	}
}