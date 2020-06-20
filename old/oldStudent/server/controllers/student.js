let model = require('../models/student');
let bcrypt = require('bcryptjs'); 

exports.getProfile = async function (req) {
	if(!req.body.myId) 	return {status: 418, message: 'where is id?'};

	let studentProfile 	= await model.getProfile(req.body.myId)
	let teacherInfo 	= studentProfile.group_id? await model.getTeacherByGroupId(studentProfile.group_id) : null
	let rateInfo 		= studentProfile.group_id? await model.getMyRate(studentProfile.group_id) : null
	// let finishedRates 	= await model.getFinishedCourses(req.body.myId)

	if(!studentProfile) return {status: 202, message: 'student not found'};
	else 				return {status: 200, body: studentProfile, teacherInfo, rateInfo};
}

exports.updateProfile = async function(req) {
	if(!req.body.myId) 			return {status: 418, message: 'no id'};
	if(!req.body.firstname)		return {status: 418, message: 'no firstname'};
	if(!req.body.lastname)		return {status: 418, message: 'no lastname'};
	if(!req.body.birthday)		return {status: 418, message: 'no birthday'};
	
	let result = await model.updateProfile(req.body.myId, req.body.firstname, req.body.lastname, req.body.birthday);
	if(result) 	return {status: 200, message: 'success'};
	else		return {status: 202, message: 'student not found'};
}

exports.deleteProfile = async function(req) {
	if(!req.body.myId) 	return {status: 418, message: 'no id'};
	let result = await model.deleteProfile(req.body.myId);
	if(result) 	return {status: 200, message: 'success'};
	else		return {status: 202, message: 'student not found'};
}

exports.updatePassword = async function(req) {
	if(!req.body.old) 			return {status: 418, message: 'no old'};
	if(!req.body.password) 		return {status: 418, message: 'no password'};

	let studentInfo = await model.getStudentInfoById(req.body.myId);

	if(!studentInfo) return {status: 202, message: 'student not found'}

	let check = await bcrypt.compare(req.body.old, studentInfo.pass);
	if(!check) return {status: 403, message: 'old password is incorrect'}
	else {
		let salt = await bcrypt.genSalt(10);
		let hash = await bcrypt.hash(req.body.password, salt);
		
		let result = await model.updatePassword(req.body.myId, hash);
		if(result) 	return {status: 200, message: 'success', hash};
		else 		return {status: 202, message: 'backend error'};
	}
}