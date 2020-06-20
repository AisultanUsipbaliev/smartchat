const configModel 	= require('../apiModels/config');
const bcrypt 	= require('bcryptjs');

exports.Sign = async function(req)
{
	if(!req.body.password) return { status: 418, message: 'no password' };

	let pass = await configModel.getPassword();
	let check = await bcrypt.compare(req.body.password, pass);

	return check ? { status: 200 } : { status: 202 };
}
exports.ChangePass = async function(req)
{
	if(!req.body.old) return { status: 418, message: 'no old' };
	if(!req.body.new) return { status: 418, message: 'no new' };

	let pass = await configModel.getPassword();
	let check = await bcrypt.compare(pass, req.body.old);
	
	if(check)
	{
		let salt = await bcrypt.genSalt(11); 
		let hash = await bcrypt.hash(req.body.new, salt);
		let res = await configModel.changePass(hash);
		if(res) return {status: 200};
		else 	return {status: 202};
	}
	else 		return { status: 401 };
} 
exports.GetConfig = async function(req)
{
	if (config.production && !req.session.sid) return { status: 401 } 

	let configs = await configModel.getConfig();
	
	let result;

	if (configs) {
		let teachers = await configModel.getSelectedTeacher();
		result = Object.assign({ teachers }, configs);
	}
	

	return configs ? { status: 200, result } : { status: 202 };
} 
exports.UpdateConfig = async function(req)
{
	if (config.production && !req.session.sid) return { status: 401 } 

	req.body.data = JSON.parse(req.body.data)
	req.body.passwords = JSON.parse(req.body.passwords)

	if (!req.body.data) 	return { status: 400, message: 'no data' }

	if (!req.body.data.login) 						return { status: 400, message: 'no login' } 
	if (!req.body.data.students) 					return { status: 400, message: 'no students' } 
	if (!req.body.data.min_students) 			return { status: 400, message: 'no min_students' } 
	if (!req.body.data.groups) 						return { status: 400, message: 'no groups' } 
	if (!req.body.data.quickTeacher) 			return { status: 400, message: 'no quickTeacher' } 
	if (!req.body.data.defaultCost) 			return { status: 400, message: 'no defaultCost' } 
	if (!req.body.data.trialDefaultCost) 	return { status: 400, message: 'no trialDefaultCost' } 
	if (!req.body.data.goodTrial) 				return { status: 400, message: 'no goodTrial' }

	if (req.body.passwords) {
		if (!req.body.passwords.new_pass) 	return { status: 400, message: 'no new_pass' } 
		if (!req.body.passwords.old_pass) 	return { status: 400, message: 'no old_pass' } 

		let pass = await configModel.getPassword();
		let check = await bcrypt.compare(pass, req.body.passwords.old_pass);

		if(check)
		{
			let salt = await bcrypt.genSalt(11);
			let hash = await bcrypt.hash(req.body.passwords.new_pass, salt);
			let res = await configModel.changePass(hash);
			if(!res) return { status: 202 };
		}
		else 		return { status: 401 };
	}

	let result = await configModel.updateConfig(req.body.data.login, req.body.data.students, req.body.data.min_students, req.body.data.groups, req.body.data.quickTeacher, req.body.data.defaultCost, req.body.data.trialDefaultCost, req.body.data.goodTrial);

	return result ? { status: 200 } : { status: 202 };
} 
