const bcrypt 		= require('bcryptjs');

const configModel 	= require('../../apiModels/config'),
	  teacherModel  = require('../../apiModels/teacher'),
	  mailModel  = require('../../apiModels/mail');

exports.updatePassword = async (req) => {
	if(!req.body.old_pass) return { status: 418, message: 'no old_pass' };
	if(!req.body.new_pass) return { status: 418, message: 'no new_pass' };

	let pass = await configModel.getPassword();
	let check = await bcrypt.compare(pass, req.body.old_pass);
	
	if (check) {
		let salt = await bcrypt.genSalt(11); 
		let hash = await bcrypt.hash(req.body.new_pass, salt);
		let res = await configModel.changePass(hash);
		if(res) return {status: 200};
		else 	return {status: 202};
	} else {
		return { status: 403 };
	}
} 
exports.getSettings = async (req) => {
	let config = await configModel.getConfig();
	
	if (config) {
		let teachers = await teacherModel.getSelectedTeacher();
		let result = Object.assign({ teachers }, config);
		return { status: 200, result }
	} else {
		return { status: 202 };
	}
} 
exports.updateSettings = async (req) => {
	let data, passwords;

	try {
		data = JSON.parse(req.body.data)
	} catch (e) {
		return { status: 400, message: 'invalid data' }
	}

	if (!data) 					 return { status: 400, message: 'no data' }

	if (!data.max_students) 		 return { status: 400, message: 'no max_students' } 
	if (!data.min_students) 	 return { status: 400, message: 'no min_students' } 
	if (!data.max_groups) 			 return { status: 400, message: 'no max_groups' } 
	if (!data.quickTeacher) 	 return { status: 400, message: 'no quickTeacher' } 
	if (!data.defaultCost) 		 return { status: 400, message: 'no defaultCost' } 
	if (!data.trialDefaultCost)  return { status: 400, message: 'no trialDefaultCost' } 
	if (!data.goodTrial) 		 return { status: 400, message: 'no goodTrial' }

	let result = await configModel.updateConfig(data.max_students, data.min_students, data.max_groups, data.quickTeacher, data.defaultCost, data.trialDefaultCost, data.goodTrial);

	return result ? { status: 200 } : { status: 202 };
} 

exports.getMessages = async () => {
	let messages  = await mailModel.getAll(); 
	return messages.length ? { status: 200, messages } : { status: 204 };
}

exports.updateMessages = async (req) => {
	if (!req.body.id) { return { status: 418, message: 'no id' } }
	if (!req.body.message) { return { status: 418, message: 'no message' } }

	let result = await mailModel.updateMail(req.body.id, req.body.message);
			
	return result ? { status: 200 } : { status: 204 } 
}
