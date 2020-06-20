const controller = require('../controllers/account');

module.exports = async (req, res) => {
	try {
		if (!req.body.method) throw new Error("NOT FOUND METHOD PROVIDED!");

		let result = null;

		switch (req.body.method.toUpperCase()) {
			case 'SIGN': 		  result = await controller.sign(req); if(result.status == 200) { req.session.sid = 1 } break;
			default: 			  result = { status: 405, message: "INVALID METHOD"}; 									break;
		}

		res.status(result.status).json(result);
	} catch (err) {
		console.error(err)
		sayMe('Admin/account', req.body, err.message)
		res.status(500).json({err: 'Server error :('})
	}
}