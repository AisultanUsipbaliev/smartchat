const bcrypt 		= require('bcryptjs');

const configModel 	= require('../../apiModels/config');

exports.sign = async (req) => {
	if(!req.body.password) return { status: 418, message: 'no password' };

	let pass = await configModel.getPassword();
	let check = await bcrypt.compare(req.body.password, pass);

	return check ? { status: 200 } : { status: 202 };
}

